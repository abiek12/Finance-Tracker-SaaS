import { IUser } from "../models/interfaces/user.interface";
import { UserRepository } from "../models/repositories/user.repository";
import { UserRegData } from "../types/user.types";
import { hashPassword } from "../utils/common.utils";
import logger from "../utils/logger.utils";

export class AuthServices {
    private userRepository = new UserRepository();

    userRegistration = async (userData: UserRegData): Promise<IUser> => {
        try {
            const hashedPassword = await hashPassword(userData.password);
            const userDetails = {
                ...userData,
                password: hashedPassword
            };

            const newUser = await this.userRepository.createUser(userDetails);
            return newUser;
        } catch (error) {
            logger.error("USER-REG-SERVICES:: Error in userRegistration service: ", error);
            throw error;
        }
    }
}