import { CommonEnums } from "../models/enums/common.enum";

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
    | { status: CommonEnums.SUCCESS; user: any }
    | { status: CommonEnums.INVALID; user: null };

export interface passwords {
    newPassword: string;
    currentPassword?: string;
}