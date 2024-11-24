import { UserServices } from "../services/user.services";
import { Request, Response } from "express";
import logger from "../utils/logger.utils";
import { BAD_REQUEST, CONFLICT, INTERNAL_ERROR, NOT_FOUND, SUCCESS, validateEmail } from "../utils/common.utils";
import { errorResponse, successResponse } from "../utils/responseHandler.utils";
import { CommonEnums } from "../models/enums/common.enum";
import { EmailServices } from "../services/email.services";
import { forgotPasswordRequest } from "../types/user.types";

export class UserControllers {
    private userServices = new UserServices();
    private emailServices = new EmailServices();

    // Get User Details
    getUserDetails = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            if(!userId) {
                logger.error("GET-USER-CONTROLLER:: Missing required fields");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Missing required fields"));
                return;
            }

            const userDetails = await this.userServices.getUserDetails(userId);
            if(!userDetails) {
                logger.error("GET-USER-CONTROLLER:: User not found");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "User not found"));
                return;
            }

            logger.info("GET-USER-CONTROLLER:: User details fetched successfully");
            res.status(SUCCESS).send(successResponse(SUCCESS, userDetails, "User details fetched successfully"));
        } catch (error) {
            logger.error("GET-USER-CONTROLLER:: Error in getUserDetails controller: ", error);
            res.status(INTERNAL_ERROR).send(errorResponse(INTERNAL_ERROR, "Error while fetching user details!"));  
        }
    }

    // Update User Details
    updateUserDetails = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const updatedData = req.body;
            if(!userId) {
                logger.error("UPDATE-USER-CONTROLLER:: Missing required fields");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Missing required fields"));
                return;
            }

            const user = await this.userServices.updateUserDetails(userId, updatedData);
            if(user === CommonEnums.USER_NOT_FOUND) {
                logger.error("UPDATE-USER-CONTROLLER:: User not found");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "User not found"));
                return;
            }

            if(!user) {
                logger.error("UPDATE-USER-CONTROLLER:: Error while updating user details");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Error while updating user details"));
                return;
            }

            logger.info("UPDATE-USER-CONTROLLER:: User details updated successfully");
            res.status(SUCCESS).send(successResponse(SUCCESS, user, "User details updated successfully"));
        } catch (error) {
            logger.error("UPDATE-USER-CONTROLLER:: Error in updateUser controller: ", error);
            res.status(INTERNAL_ERROR).send(errorResponse(INTERNAL_ERROR, "Error while updating user details!"));   
        }
    }

    // Send Verification Email
    sendVerificationEmail = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            if(!userId) {
                logger.error("SEND-VERIFICATION-USER-CONTROLLER:: Missing required fields");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Missing required fields"));
                return;
            }

            const response = await this.emailServices.sendVerificationEmail(userId);
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

            logger.info("SEND-VERIFICATION-USER-CONTROLLER:: Verification email sent successfully");
            res.status(SUCCESS).send(successResponse(SUCCESS, null, "Verification email sent successfully"));
        } catch (error) {
            logger.error("SEND-VERIFICATION-USER-CONTROLLER:: Error in sendVerificationEmail controller: ", error);
            res.status(INTERNAL_ERROR).send(errorResponse(INTERNAL_ERROR, "Error while sending verification email!"));
        }
    }

    // User Email Verification
    userVerification = async (req: Request, res: Response) => {
        try {
            const userId: string = req.params.userId;
            const verificationToken: string = req.query.token as string;

            if(!userId) {
                logger.error("USER-VERIFICATION-SERVICES:: User id not found!");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "User id not found!"));
                return;
            }

            if(!verificationToken) {
                logger.error("USER-VERIFICATION-SERVICES:: Verification token not found!");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Verification token not found!"));
                return;
            }

            const response: CommonEnums = await this.userServices.userVerification(userId, verificationToken);
            if(response === CommonEnums.USER_NOT_FOUND) {
                logger.error("USER-VERIFICATION-SERVICES:: User not found");
                res.status(NOT_FOUND).send(errorResponse(NOT_FOUND, "User not found"));
                return;
            }

            if(response === CommonEnums.USER_ALREADY_VERIFIED) {
                logger.error("USER-VERIFICATION-SERVICES:: User already verified");
                res.status(CONFLICT).send(errorResponse(CONFLICT, "User already verified"));
                return;
            }

            if(response === CommonEnums.INVALID) {
                logger.error("USER-VERIFICATION-SERVICES:: Invalid token");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Invalid token"));
                return;
            }

            logger.info("USER-VERIFICATION-SERVICES:: User verified successfully");
            res.status(SUCCESS).send(successResponse(SUCCESS, null, "User verified successfully"));
        } catch (error) {
            logger.error("USER-VERIFICATION-SERVICES:: Error in userVerification controller: ", error);
            res.status(INTERNAL_ERROR).send(errorResponse(INTERNAL_ERROR, "Error while verifying user!"));
            return;
        }
    }

    // Forgot Password
    forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body as forgotPasswordRequest;
            if(!email) {
                logger.error("FORGOT-PASSWORD-USER-CONTROLLER:: Missing email field");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Missing email field"));
                return;
            }

            if(!validateEmail(email)) {
                logger.error("FORGOT-PASSWORD-USER-CONTROLLER:: Invalid email format");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Invalid email format"));
                return;
            }

            const response = await this.emailServices.forgotPassword(email);
            if(response === CommonEnums.USER_NOT_FOUND) {
                logger.error("FORGOT-PASSWORD-USER-CONTROLLER:: User not found");
                res.status(NOT_FOUND).send(errorResponse(NOT_FOUND, "User not found"));
                return;
            }

            if(response === CommonEnums.FAILED) {
                logger.error("FORGOT-PASSWORD-USER-CONTROLLER:: Error while sending forgot password email");
                res.status(CONFLICT).send(errorResponse(CONFLICT, "Error while sending forgot password email"));
                return;
            }

            logger.info("FORGOT-PASSWORD-USER-CONTROLLER:: Forgot password email sent successfully");
            res.status(SUCCESS).send(successResponse(SUCCESS, null, "Forgot password email sent successfully"));
            return;
        } catch (error) {
            logger.error("FORGOT-PASSWORD-USER-CONTROLLER:: Error in forgotPassword controller: ", error);
            res.status(INTERNAL_ERROR).send(errorResponse(INTERNAL_ERROR, "Error while sending forgot password email!"));
        }
    }
}