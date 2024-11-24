import nodemailer from 'nodemailer';
import logger from './logger.utils';
import ejs from 'ejs';
import path from 'path';

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

// Render Ejs template
export const renderTemplate = (templateName: string, data: any) => {
    try {
        return new Promise((resolve, reject) => {
            const templatesPath = path.join(__dirname, "..", "templates"); // Go up one directory level
            const templatePath = path.join(templatesPath, templateName);

            ejs.renderFile(templatePath, data, (err, html) => {
                if(err) {
                    logger.error(`EJS TEMPLTE RENDERING:: Error rendering template: ${err}`);
                    reject(err);
                }
                resolve(html);
            });
        });
    } catch (error) {
        logger.error(`EJS TEMPLTE RENDERING:: Error rendering template: ${error}`);
        throw error;
    }
}

// Send mail function
export const sendMail = async (to: string, subject: string, templateName: string, data: any): Promise<boolean | Error> => {
    try {
        const html = await renderTemplate(templateName, data) as string;
        
        const mailOptions = {
            from: process.env.MAIL_USER,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        if(!info.messageId) {
            logger.error('MAILER:: Error sending email!');
            return false;
        }

        logger.info(`MAILER:: Email sent successfully: ${info.messageId}`);
        return true;
    } catch (error) {
        logger.error(`MAILER:: Error sending email!: ${error}`);
        throw error;
    }
};