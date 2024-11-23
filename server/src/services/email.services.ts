import { UserRepository } from "../models/repositories/user.repository";
import logger from "../utils/logger.utils";

export class EmailServices {
    private userRepository = new UserRepository();
    
    // Send verification email
    sendVerificationEmail = async (userId: string) => {
        try {
            // Get use details
            const user = await this.userRepository.findUserById(userId);

            if(!user) {
                logger.error("EMAIL-SERVICES:: User not found!");
                return;
            }

            // Creating and storing verification token
            const verificationToken = await createUniqueToken(userId);
        } catch (error) {
            logger.error("EMAIL-SERVICES:: Error sending verification email: ", error);
            throw error;
        }
    }
}