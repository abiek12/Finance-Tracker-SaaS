import { CommonReturns } from "../models/enums/common.enum";
import { UserRepository } from "../models/repositories/user.repository";
import { createUniqueToken } from "../utils/common.utils";
import logger from "../utils/logger.utils";
import { sendMail } from "../utils/mailer.utils";

export class EmailServices {
    private userRepository = new UserRepository();
    
    // Send verification email
    sendVerificationEmail = async (userId: string): Promise< CommonReturns | null | boolean | Error> => {
        try {
            // Get use details
            const user = await this.userRepository.findUserById(userId);

            if(!user) {
                logger.error("EMAIL-SERVICES:: User not found!");
                return CommonReturns.USER_NOT_FOUND;
            }

            // Creating and storing verification token
            const verificationToken = await createUniqueToken(userId);
            await this.userRepository.setVerificationToken(userId, {
                verificationToken,
                verificationTokenExpires: new Date(Date.now() + 5 * 60 * 1000)
            });
            
            const templateReplacement = {
                userName: user.userName,
                verificationLink: `${process.env.FRONTEND_URL}/verify-email/?token=${verificationToken}`
            };

            // Send verification email
            const res = await sendMail(user.email, "Email Verification", "verifyEmail.template.ejs", templateReplacement);
            if(!res) {
                return CommonReturns.FAILED;
            }

            return CommonReturns.SUCCESS;
        } catch (error) {
            logger.error("EMAIL-SERVICES:: Error sending verification email: ", error);
            throw error;
        }
    }

    // Send forgot password email
    forgotPassword = async (email: string): Promise<CommonReturns> => {
        try {
            const user = await this.userRepository.findUserByEmail(email);
            if(!user) {
                logger.error("EMAIL-SERVICES:: User not found!");
                return CommonReturns.USER_NOT_FOUND;
            }

            // Creating and storing verification token
            const verificationToken = await createUniqueToken(user._id);
            await this.userRepository.setVerificationToken(user._id, {
                verificationToken,
                verificationTokenExpires: new Date(Date.now() + 5 * 60 * 1000)
            });

            const templateReplacement = {
                userName: user.userName,
                resetPasswordLink: `${process.env.FRONTEND_URL}/reset-password/?token=${verificationToken}`
            };

            // Send forgot password email
            const res = await sendMail(user.email, "Forgot Password", "forgotPassword.template.ejs", templateReplacement);
            if(!res) {
                return CommonReturns.FAILED;
            }

            return CommonReturns.SUCCESS;
        } catch (error) {
            logger.error("EMAIL-SERVICES:: Error sending forgot password email: ", error);
            throw error;   
        }
    }
}