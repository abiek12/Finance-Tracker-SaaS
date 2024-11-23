import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.utils';
import { INTERNAL_ERROR, UNAUTHORIZED, UNAUTHORIZED_MSG } from '../utils/common.utils';
import { errorResponse } from '../utils/responseHandler.utils';
import jwt from 'jsonwebtoken';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            logger.error("VERIFY-TOKEN-MIDDLEWARE:: Missing authorization header");
            res.status(UNAUTHORIZED).send(errorResponse(UNAUTHORIZED, "Missing authorization header", UNAUTHORIZED_MSG, "Authorization header is required"));
            return;
        }

        const token = authHeader.split(" ")[1];
        if(!token) {
            logger.error("VERIFY-TOKEN-MIDDLEWARE:: Missing or invalid authorization header");
            res.status(UNAUTHORIZED).send(errorResponse(UNAUTHORIZED, "Missing or invalid authorization header", UNAUTHORIZED_MSG, "Token is required"));
            return;
        }
        
        // Verify token
        const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";
        jwt.verify(token, TOKEN_SECRET, (err, user) => {
            if(err) {                
                logger.error("VERIFY-TOKEN-MIDDLEWARE:: Invalid token");
                res.status(UNAUTHORIZED).send(errorResponse(UNAUTHORIZED, "Invalid token", UNAUTHORIZED_MSG, "Token is invalid"));
                return;
            }

            (req as any).user = user;
            next();
        });
    } catch (error) {
        logger.error("VERIFY-TOKEN-MIDDLEWARE:: Error in verifyToken middleware: ", error);
        res.status(INTERNAL_ERROR).send(errorResponse(INTERNAL_ERROR, "Error while verifying token!", "Internal Server Error"));
    }
}

