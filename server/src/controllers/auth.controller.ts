import { Request, Response } from "express";
import { AuthServices } from "../services/auth.services";
import { UserRegData } from "../types/user.types";
import logger from "../utils/logger.utils";
import { BAD_REQUEST, SUCCESS } from "../utils/common.utils";
import { errorResponse, successResponse } from "../utils/responseHandler.utils";
import { UserRepository } from "../models/repositories/user.repository";

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
            res.status(200).send(successResponse(SUCCESS, newUser, "User registered successfully"));
            return;
        } catch (error) {
            logger.error("USER-REG-CONTROLLER:: Error in userRegistration controller: ", error);
            res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Error in userRegistration controller"));
            return;
        }
    }

    // User Login
}