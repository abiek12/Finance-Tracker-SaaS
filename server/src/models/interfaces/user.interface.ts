import { UserRoles, UserStatus } from "../enums/user.enum";

export interface IUser {
    _id: string;
    userName: string;
    email: string;
    phone: string;
    password: string;
    isEmailVerified: boolean;
    twoFA: boolean;
    otp: string;
    otpExpireTime: Date;
    oauthProvider: string;
    oauthId: string;
    loginAttempts: number;
    lockUntil: Date;
    lastLogin: Date;
    profilePicture: string;
    verificationToken: string;
    verificationTokenExpires: Date;
    role: UserRoles;
    status: UserStatus;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}