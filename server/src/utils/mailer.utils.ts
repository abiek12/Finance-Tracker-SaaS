import nodemailer from 'nodemailer';
import logger from './logger.utils';

// Create a transport object
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

// Send mail function
export const sendMail = async (to: string, subject: string, text: string, html: string) => {
    try {
        const mailOptions = {
            from: process.env.MAIL_USER,
            to,
            subject,
            text,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info(`MAILER:: Email sent successfully: ${info.messageId}`);
    } catch (error) {
        logger.error(`MAILER:: Error sending email!: ${error}`);
        throw error;
    }
};