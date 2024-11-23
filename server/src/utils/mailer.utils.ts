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
            ejs.renderFile(path.join(__dirname, '../templates', templateName), data, (err, html) => {
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
export const sendMail = async (to: string, subject: string, templateName: string, data: any) => {
    try {
        const html = await renderTemplate(templateName, data) as string;
        
        const mailOptions = {
            from: process.env.MAIL_USER,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info(`MAILER:: Email sent successfully: ${info.messageId}`);
    } catch (error) {
        logger.error(`MAILER:: Error sending email!: ${error}`);
        throw error;
    }
};