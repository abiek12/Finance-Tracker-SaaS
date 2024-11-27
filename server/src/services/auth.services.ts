import { mapToUserResponse } from "../dtos/user.dto";
import { CommonReturns } from "../models/enums/common.enum";
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
                return { status: CommonReturns.USER_NOT_FOUND };
            }

            if(user.status === UserStatus.PENDING) {
                return { status: CommonReturns.USER_NOT_VERIFIED };
            }
            
            const isPasswordMatched = await comparePassword(userData.password, user.password);
            if(!isPasswordMatched) {
                return { status: CommonReturns.INVALID_PASSWORD };
            }

            const accessToken: string = await generateAccessToken(user._id);
            const refreshToken: string = await generateRefreshToken(user._id);
            await this.userRepository.updateUserLastLogin(user._id);

            const userResponse = mapToUserResponse(user);

            return {
                status: CommonReturns.SUCCESS,
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
}