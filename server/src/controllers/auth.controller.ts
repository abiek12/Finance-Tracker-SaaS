import { Request, Response } from "express";
import { AuthServices } from "../services/auth.services";
import { UserLoginResult, UserRegData } from "../types/user.types";
import logger from "../utils/logger.utils";
import { BAD_REQUEST, CONFLICT, INTERNAL_ERROR, SUCCESS, validateEmail } from "../utils/common.utils";
import { errorResponse, successResponse } from "../utils/responseHandler.utils";
import { UserRepository } from "../models/repositories/user.repository";
import { CommonEnums } from "../models/enums/common.enum";
import { EmailServices } from "../services/email.services";

export class AuthController {
    private authServices = new AuthServices();
    private userRepo = new UserRepository();
    private emailServices = new EmailServices();
    
    // User Registration
    userRegistration = async (req: Request, res: Response) => {
        try {
            const userData = req.body as UserRegData;
            if(!userData.email || !userData.password) {
                logger.error("USER-REG-CONTROLLER:: Missing required fields");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Missing required fields"));
                return;
            }

            if(!validateEmail(userData.email)) {
                logger.error("USER-REG-CONTROLLER:: Invalid email format");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Invalid email format"));
                return;
            }

            const existingUser = await this.userRepo.findUserByEmail(userData.email);
            if(existingUser) {
                logger.error("USER-REG-CONTROLLER:: User already exists with this email");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "User already exists with this email"));
                return;
            }

            if(userData.phone) {
                if(userData.phone.length !== 10) {
                    logger.error("USER-REG-CONTROLLER:: Invalid phone number");
                    res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Invalid phone number"));
                    return;
                }

                const existingUserWithPhone = await this.userRepo.findUserByPhone(userData.phone);
                if(existingUserWithPhone) {
                    logger.error("USER-REG-CONTROLLER:: User already exists with this phone number");
                    res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "User already exists with this phone number"));
                    return;
                }
            }

            const newUser = await this.authServices.userRegistration(userData);
            if(!newUser || !newUser.id) {
                logger.error("USER-REG-CONTROLLER:: Error while registering user");
                res.status(CONFLICT).send(errorResponse(CONFLICT, "Error while registering user"));
                return;
            }

            // Send verification email
            const response = await this.emailServices.sendVerificationEmail(newUser.id);

            if(response === CommonEnums.USER_NOT_FOUND) {
                logger.error("SEND-VERIFICATION-USER-CONTROLLER:: User not found");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "User not found"));
                return;
            }

            if(response === CommonEnums.FAILED) {
                logger.error("SEND-VERIFICATION-USER-CONTROLLER:: Error while sending verification email");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Error while sending verification email"));
                return;
            }

            logger.info("USER-REG-CONTROLLER:: User registered successfully");
            logger.info("USER-REG-CONTROLLER:: Verification email sent successfully");
            res.status(SUCCESS).send(successResponse(SUCCESS, newUser, "User registered successfully. Please verify your email to login."));
            return;
        } catch (error) {
            logger.error("USER-REG-CONTROLLER:: Error in userRegistration controller: ", error);
            res.status(INTERNAL_ERROR).send(errorResponse(INTERNAL_ERROR, "Error while registering user!"));
            return;
        }
    }

    // User Login
    userLogin = async (req: Request, res: Response) => {
        try {
            const userData = req.body as UserRegData;
            if(!userData.email || !userData.password) {
                logger.error("USER-REG-CONTROLLER:: Missing required fields");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Missing required fields"));
                return;
            }

            // User login service
            const authServiceRes: UserLoginResult = await this.authServices.userLogin(userData);

            if(authServiceRes.status === CommonEnums.USER_NOT_FOUND) {
                logger.error("USER-REG-CONTROLLER:: User not found");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "User not found"));
                return;
            }

            if(authServiceRes.status === CommonEnums.USER_NOT_VERIFIED) {
                logger.error("USER-REG-CONTROLLER:: User not verified");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "User not verified, Please verify your email to login"));
                return;
            }

            if(authServiceRes.status === CommonEnums.INVALID_PASSWORD) {
                logger.error("USER-REG-CONTROLLER:: Invalid Password");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Invalid Password"));
                return;
            }

            const resData = {
                userId: authServiceRes.data.userResponse.id,
                userName: authServiceRes.data.userResponse.userName,
                accessToken: authServiceRes.data.accessToken,
                refreshToken: authServiceRes.data.refreshToken
            }

            logger.info("USER-LOGIN-CONTROLLER:: User logged in successfully");
            res.status(SUCCESS).send(successResponse(SUCCESS, resData, "User logged in successfully"));
            return;
        } catch (error) {
            logger.error("USER-REG-CONTROLLER:: Error in userLogin controller: ", error);
            res.status(INTERNAL_ERROR).send(errorResponse(INTERNAL_ERROR, "Error while logging in user!"));
            return   
        }
    }

}