import jwt from 'jsonwebtoken';
import { CommonReturns } from '../models/enums/common.enum';
import logger from './logger.utils';
import { jwtVerificationResult } from '../types/common.types';

const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";

export const jwtVerification = async (jwtToken: string): Promise<jwtVerificationResult> => {
    try {
        return new Promise<jwtVerificationResult>((resolve, reject) => {
            jwt.verify(jwtToken, TOKEN_SECRET, (err, user) => {
                if (err) {
                    resolve({ status: CommonReturns.INVALID, user: null });
                } else {
                    resolve({ status: CommonReturns.SUCCESS, user });
                }
            });
        });
    } catch (error) {
        logger.error("VERIFY-TOKEN-UTILS:: Error in verifyToken: ", error);
        throw error;
    }
}