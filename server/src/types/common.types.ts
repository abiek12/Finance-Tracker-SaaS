import { CommonReturns } from "../models/enums/common.enum";

export type logType = {
    level: string;
    message: string;
    timestamp: string;
    stack?: string;
};

export type tokenType = {
    verificationToken: string;
    verificationTokenExpires: Date;
};

export type jwtVerificationResult = 
    | { status: CommonReturns.SUCCESS; user: any }
    | { status: CommonReturns.INVALID; user: null };

export interface passwords {
    newPassword: string;
    currentPassword?: string;
}