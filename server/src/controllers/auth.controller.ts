import { Request, Response } from "express";
import { AuthServices } from "../services/auth.services";
import { UserRegData, userLoginResponse } from "../types/user.types";
import logger from "../utils/logger.utils";
import { BAD_REQUEST, SUCCESS } from "../utils/common.utils";
import { errorResponse, successResponse } from "../utils/responseHandler.utils";
import { UserRepository } from "../models/repositories/user.repository";
import { mapToUserResponse } from "../dtos/user.dto";
import { CommonEnums } from "../models/enums/common.enum";

export class AuthController {
    private authServices = new AuthServices();
    private userRepo = new UserRepository();
    
    // User Registration
    userRegistration = async (req: Request, res: Response) => {
        try {
            const userData = req.body as UserRegData;
            if(!userData.userName || !userData.email || !userData.password) {
                logger.error("USER-REG-CONTROLLER:: Missing required fields");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Missing required fields"));
                return;
            }

            const existingUser = await this.userRepo.findUserByEmail(userData.email);
            if(existingUser) {
                logger.error("USER-REG-CONTROLLER:: User already exists with this email");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "User already exists with this email"));
                return;
            }

            const newUser = await this.authServices.userRegistration(userData); 

            logger.info("USER-REG-CONTROLLER:: User registered successfully");
            res.status(SUCCESS).send(successResponse(SUCCESS, newUser, "User registered successfully"));
            return;
        } catch (error) {
            logger.error("USER-REG-CONTROLLER:: Error in userRegistration controller: ", error);
            res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Error in userRegistration controller"));
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

            const userResponse: userLoginResponse | null | CommonEnums.INVALID_PASSWORD = await this.authServices.userLogin(userData);
            if(!userResponse) {
                logger.error("USER-REG-CONTROLLER:: User not found");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "User not found"));
                return;
            }

            if(userResponse === CommonEnums.INVALID_PASSWORD) {
                logger.error("USER-REG-CONTROLLER:: Invalid Password");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Invalid Password"));
                return;
            }

            logger.info("USER-LOGIN-CONTROLLER:: User logged in successfully");
            res.status(SUCCESS).send(successResponse(SUCCESS, userResponse, "User logged in successfully"));
            return;
        } catch (error) {
            logger.error("USER-REG-CONTROLLER:: Error in userLogin controller: ", error);
            res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Error in userLogin controller"));
            return   
        }
    }
}