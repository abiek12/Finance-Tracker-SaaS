import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.utils';
import { BAD_REQUEST } from '../utils/common.utils';
import { errorResponse } from '../utils/responseHandler.utils';
import jwt from 'jsonwebtoken';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            logger.error("VERIFY-TOKEN-MIDDLEWARE:: Missing authorization header");
            res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Missing authorization header"));
            return;
        }

        const token = authHeader.split(" ")[1];
        if(!token) {
            logger.error("VERIFY-TOKEN-MIDDLEWARE:: Missing or invalid authorization header");
            res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Missing or invalid authorization header"));
            return;
        }
        
        // Verify token
        const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";
        jwt.verify(token, TOKEN_SECRET, (err, user) => {
            if(err) {
                logger.error("VERIFY-TOKEN-MIDDLEWARE:: Invalid token");
                res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Invalid token"));
                return;
            }

            (req as any).user = user;
            next();
        });
    } catch (error) {
        logger.error("VERIFY-TOKEN-MIDDLEWARE:: Error in verifyToken middleware: ", error);
        res.status(BAD_REQUEST).send(errorResponse(BAD_REQUEST, "Error while verifying token!"));
    }
}

