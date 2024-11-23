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
    resetPasswordToken: string;
    resetPasswordExpires: Date;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}