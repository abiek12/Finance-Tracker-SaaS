import { UserRepository } from "../models/repositories/user.repository";
import { createUniqueToken } from "../utils/common.utils";
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
            await this.userRepository.setVerificationToken(userId, {
                verificationToken,
                verificationTokenExpires: new Date(Date.now() + 5 * 60 * 1000)
            });

            // Send verification email
            
        } catch (error) {
            logger.error("EMAIL-SERVICES:: Error sending verification email: ", error);
            throw error;
        }
    }
}