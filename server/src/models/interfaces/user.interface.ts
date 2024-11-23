export interface IUser {
    _id: string;
    userName: string;
    email: string;
    phone: string;
    password: string;
    isEmailVerified: boolean;
    twoFA: boolean;
    otp: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}