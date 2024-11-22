import { mapToUserResponse } from "../dtos/user.dto";
import { UserRepository } from "../models/repositories/user.repository";
import { UserResponseDto } from "../types/user.types";
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
}