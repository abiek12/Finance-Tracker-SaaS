import { mapToUserResponse } from "../dtos/user.dto";
import { CommonEnums } from "../models/enums/common.enum";
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

    updateUserDetails = async (id: string, data: any): Promise<UserResponseDto | null | CommonEnums.USER_NOT_FOUND> => {
        try {
            const isUserExist = await this.userRepository.findUserById(id);
            if(!isUserExist) return CommonEnums.USER_NOT_FOUND;

            const user = await this.userRepository.updateUserById(id, data);
            if(!user) return null;

            return mapToUserResponse(user);
        } catch (error) {
            logger.error("UPDATE-USER-SERVICES:: Error in UserServices.updateUserDetails: ", error);
            throw error;
        }
    }

    // User Verification
    userVerification = async (token: string): Promise<CommonEnums> => {
        try {
            // Get user id and token from token
            const verifyTokenRes: jwtVerificationResult = await jwtVerification(token);
            if(verifyTokenRes.status !== CommonEnums.SUCCESS) {
                return CommonEnums.INVALID;
            }
            
            const user = await this.userRepository.findUserById(verifyTokenRes.user.userId);
            if(!user) {
                return CommonEnums.USER_NOT_FOUND;
            }

            // Check if user is already verified. This case applicable for email verification during forgot password after user is already verified
            if(user.status === UserStatus.ACTIVE) {
                return CommonEnums.USER_ALREADY_VERIFIED;
            }

            // Check if token is valid
            if(user.verificationToken !== token) {
                return CommonEnums.INVALID;
            }

            // Check if the token is expired
            const currentTime = new Date().getTime();
            if(user.verificationTokenExpires.getTime() < currentTime) {
                return CommonEnums.EXPIRED;
            }

            // Update user status to active
            await this.userRepository.updateUserStatus(user._id, UserStatus.ACTIVE);

            return CommonEnums.SUCCESS;
        } catch (error) {
            logger.error("USER-VERIFICATION-SERVICES:: Error in userVerification service: ", error);
            throw error;
        }
    }

    // Reset Password
    resetPassword = async (passwords: passwords, token?: string, userId?:string): Promise<CommonEnums> => {
        try {
            let user;

            // Case 1: Forgot Password (Without Login)
            if(token) {
                const verifyTokenRes: jwtVerificationResult = await jwtVerification(token);
                if(verifyTokenRes.status !== CommonEnums.SUCCESS) {
                    return CommonEnums.INVALID;
                }
                user = await this.userRepository.findUserById(verifyTokenRes.user.userId);

                if(!user) {
                    return CommonEnums.USER_NOT_FOUND;
                }

                // Check if token is valid
                if(user.verificationToken !== token) {
                    return CommonEnums.INVALID;
                }

                // Check if the token is expired
                const currentTime = new Date().getTime();
                if(user.verificationTokenExpires.getTime() < currentTime) {
                    return CommonEnums.EXPIRED;
                }
            }

            // Case 2: Inside the App (With Login)
            else if (userId) {
                user = await this.userRepository.findUserById(userId);

                if(!user) {
                    return CommonEnums.USER_NOT_FOUND;
                }

                // check current password and new password are same
                if (!passwords.newPassword || !passwords.currentPassword) {
                    return CommonEnums.MISSING_REQUIRED_FIELDS;
                }

                const isPasswordMatched = await comparePassword(passwords.currentPassword, user.password);
                if(!isPasswordMatched) {
                    return CommonEnums.INVALID_PASSWORD;
                }

                if(passwords.currentPassword === passwords.newPassword) {
                    return CommonEnums.SAME_PASSWORD;
                }
            } 

            else {
                return CommonEnums.INVALID_REQUEST;
            }

            // Update user password
            const hashedPassword = await hashPassword(passwords.newPassword);
            await this.userRepository.updateUserPassword(user._id, hashedPassword);
            return CommonEnums.SUCCESS;

        } catch (error) {
            logger.error("RESET-PASSWORD-SERVICES:: Error in resetPassword service: ", error);
            throw error;
        }
    }
}