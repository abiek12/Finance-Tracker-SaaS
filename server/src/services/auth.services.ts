import { mapToUserResponse } from "../dtos/user.dto";
import { CommonEnums } from "../models/enums/common.enum";
import { UserRepository } from "../models/repositories/user.repository";
import { UserLoginData, UserRegData, UserResponseDto, userLoginResponse } from "../types/user.types";
import { comparePassword, generateAccessToken, generateRefreshToken, hashPassword } from "../utils/common.utils";
import logger from "../utils/logger.utils";

export class AuthServices {
    private userRepository = new UserRepository();

    // User Registration
    userRegistration = async (userData: UserRegData): Promise<UserResponseDto> => {
        try {
            const hashedPassword = await hashPassword(userData.password);
            const userDetails = {
                ...userData,
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
    userLogin = async (userData: UserLoginData): Promise< userLoginResponse | null | CommonEnums.INVALID_PASSWORD> => {
        try {
            const user = await this.userRepository.findUserByEmail(userData.email);
            if(!user) return null;

            const isPasswordMatched = await comparePassword(userData.password, user.password);
            if(!isPasswordMatched) return CommonEnums.INVALID_PASSWORD;

            const accessToken: string = await generateAccessToken(user._id);
            const refreshToken: string = await generateRefreshToken(user._id);
            await this.userRepository.updateUserLastLogin(user._id);

            const userResponse = mapToUserResponse(user);

            return {
                userResponse,
                accessToken,
                refreshToken
            }
            
        } catch (error) {
            logger.error("USER-REG-SERVICES:: Error in userLogin service: ", error);
            throw error;
        }
    }
}