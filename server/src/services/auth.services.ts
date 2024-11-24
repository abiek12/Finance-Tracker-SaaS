import { mapToUserResponse } from "../dtos/user.dto";
import { CommonEnums } from "../models/enums/common.enum";
import { UserStatus } from "../models/enums/user.enum";
import { UserRepository } from "../models/repositories/user.repository";
import { UserLoginData, UserLoginResult, UserRegData, UserResponseDto } from "../types/user.types";
import { comparePassword, generateAccessToken, generateRandomUserName, generateRefreshToken, hashPassword } from "../utils/common.utils";
import logger from "../utils/logger.utils";

export class AuthServices {
    private userRepository = new UserRepository();

    // User Registration
    userRegistration = async (userData: UserRegData): Promise<UserResponseDto> => {
        try {
            // Hashing password
            const hashedPassword = await hashPassword(userData.password);
            
            // Generating Random User Name
            const randomUserName = await generateRandomUserName(userData);
            const userDetails = {
                ...userData,
                userName: randomUserName,
                password: hashedPassword
            };

            const newUser = await this.userRepository.createUser(userDetails);
            const userResponse = mapToUserResponse(newUser);

            return userResponse;
        } catch (error) {
            logger.error("USER-REG-SERVICES:: Error in userRegistration service: ", error);
            throw error;
        }
    };

    // User Login
    userLogin = async (userData: UserLoginData): Promise< UserLoginResult > => {
        try {
            const user = await this.userRepository.findUserByEmail(userData.email);
            if(!user) {
                return { status: CommonEnums.USER_NOT_FOUND };
            }

            if(user.status === UserStatus.PENDING) {
                return { status: CommonEnums.USER_NOT_VERIFIED };
            }
            
            const isPasswordMatched = await comparePassword(userData.password, user.password);
            if(!isPasswordMatched) {
                return { status: CommonEnums.INVALID_PASSWORD };
            }

            const accessToken: string = await generateAccessToken(user._id);
            const refreshToken: string = await generateRefreshToken(user._id);
            await this.userRepository.updateUserLastLogin(user._id);

            const userResponse = mapToUserResponse(user);

            return {
                status: CommonEnums.SUCCESS,
                data: {
                    userResponse,
                    accessToken,
                    refreshToken
                }
            }
            
        } catch (error) {
            logger.error("USER-REG-SERVICES:: Error in userLogin service: ", error);
            throw error;
        }
    }

    // User Verification
    userVerification = async (userId: string, token: string): Promise<CommonEnums> => {
        try {
            const user = await this.userRepository.findUserById(userId);
            if(!user) {
                return CommonEnums.USER_NOT_FOUND;
            }

            // Check if user is already verified
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
}