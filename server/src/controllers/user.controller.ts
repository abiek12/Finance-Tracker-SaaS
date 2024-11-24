import { UserServices } from "../services/user.services";
import { Request, Response } from "express";
import logger from "../utils/logger.utils";
import { BAD_REQUEST, INTERNAL_ERROR, SUCCESS } from "../utils/common.utils";
import { errorResponse, successResponse } from "../utils/responseHandler.utils";
import { CommonEnums } from "../models/enums/common.enum";
import { EmailServices } from "../services/email.services";

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
}