import { mapToUserResponse } from "../dtos/user.dto";
import { CommonReturns } from "../models/enums/common.enum";
import { UserStatus } from "../models/enums/user.enum";
import { UserRepository } from "../models/repositories/user.repository";
import { jwtVerificationResult, passwords } from "../types/common.types";
import { UserResponseDto } from "../types/user.types";
import { jwtVerification } from "../utils/auth.utils";
import { comparePassword, hashPassword } from "../utils/common.utils";
import logger from "../utils/logger.utils";

export class UserServices {
    private userRepository = new UserRepository();

    getUserDetails = async (id: string): Promise<UserResponseDto | null> => {
        try {
            const user = await this.userRepository.findUserById(id);
            if(!user) return null;

            return mapToUserResponse(user);
        } catch (error) {
            logger.error("GET-USER-SERVICES:: Error in UserServices.getUserDetails: ", error);
            throw error;
        }
    }

    updateUserDetails = async (id: string, data: any): Promise<UserResponseDto | null | CommonReturns.USER_NOT_FOUND> => {
        try {
            const isUserExist = await this.userRepository.findUserById(id);
            if(!isUserExist) return CommonReturns.USER_NOT_FOUND;

            const user = await this.userRepository.updateUserById(id, data);
            if(!user) return null;

            return mapToUserResponse(user);
        } catch (error) {
            logger.error("UPDATE-USER-SERVICES:: Error in UserServices.updateUserDetails: ", error);
            throw error;
        }
    }

    // User Verification
    userVerification = async (token: string): Promise<CommonReturns> => {
        try {
            // Get user id and token from token
            const verifyTokenRes: jwtVerificationResult = await jwtVerification(token);
            if(verifyTokenRes.status !== CommonReturns.SUCCESS) {
                return CommonReturns.INVALID;
            }
            
            const user = await this.userRepository.findUserById(verifyTokenRes.user.userId);
            if(!user) {
                return CommonReturns.USER_NOT_FOUND;
            }

            // Check if user is already verified. This case applicable for email verification during forgot password after user is already verified
            if(user.status === UserStatus.ACTIVE) {
                return CommonReturns.USER_ALREADY_VERIFIED;
            }

            // Check if token is valid
            if(user.verificationToken !== token) {
                return CommonReturns.INVALID;
            }

            // Check if the token is expired
            const currentTime = new Date().getTime();
            if(user.verificationTokenExpires.getTime() < currentTime) {
                return CommonReturns.EXPIRED;
            }

            // Update user status to active
            await this.userRepository.updateUserStatus(user._id, UserStatus.ACTIVE);

            return CommonReturns.SUCCESS;
        } catch (error) {
            logger.error("USER-VERIFICATION-SERVICES:: Error in userVerification service: ", error);
            throw error;
        }
    }

    // Reset Password
    resetPassword = async (passwords: passwords, token?: string, userId?:string): Promise<CommonReturns> => {
        try {
            let user;

            // Case 1: Forgot Password (Without Login)
            if(token) {
                const verifyTokenRes: jwtVerificationResult = await jwtVerification(token);
                if(verifyTokenRes.status !== CommonReturns.SUCCESS) {
                    return CommonReturns.INVALID;
                }
                user = await this.userRepository.findUserById(verifyTokenRes.user.userId);

                if(!user) {
                    return CommonReturns.USER_NOT_FOUND;
                }

                // Check if token is valid
                if(user.verificationToken !== token) {
                    return CommonReturns.INVALID;
                }

                // Check if the token is expired
                const currentTime = new Date().getTime();
                if(user.verificationTokenExpires.getTime() < currentTime) {
                    return CommonReturns.EXPIRED;
                }
            }

            // Case 2: Inside the App (With Login)
            else if (userId) {
                user = await this.userRepository.findUserById(userId);

                if(!user) {
                    return CommonReturns.USER_NOT_FOUND;
                }

                // check current password and new password are same
                if (!passwords.newPassword || !passwords.currentPassword) {
                    return CommonReturns.MISSING_REQUIRED_FIELDS;
                }

                const isPasswordMatched = await comparePassword(passwords.currentPassword, user.password);
                if(!isPasswordMatched) {
                    return CommonReturns.INVALID_PASSWORD;
                }

                if(passwords.currentPassword === passwords.newPassword) {
                    return CommonReturns.SAME_PASSWORD;
                }
            } 

            else {
                return CommonReturns.INVALID_REQUEST;
            }

            // Update user password
            const hashedPassword = await hashPassword(passwords.newPassword);
            await this.userRepository.updateUserPassword(user._id, hashedPassword);
            return CommonReturns.SUCCESS;

        } catch (error) {
            logger.error("RESET-PASSWORD-SERVICES:: Error in resetPassword service: ", error);
            throw error;
        }
    }
}