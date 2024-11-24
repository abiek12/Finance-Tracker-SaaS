import { CommonEnums } from "../models/enums/common.enum";

export interface UserResponseDto {
    id: string;
    userName: string;
    email: string;
    phone: string;
    isEmailVerified: boolean;
    twoFactorAuth: boolean;
    role: string;
    status: string;
    profilePicture: string;
    lastLogin: Date;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserLoginData {
    email: string;
    password: string;
}

export interface UserRegData extends UserLoginData {
    phone: string;
}

export type userLoginResponse = {
    userResponse: UserResponseDto;
    accessToken: string;
    refreshToken: string;
}

export type UserLoginResult = 
    | { status: CommonEnums.SUCCESS; data: userLoginResponse }
    | { status: CommonEnums.USER_NOT_VERIFIED }
    | { status: CommonEnums.INVALID_PASSWORD }
    | { status: CommonEnums.USER_NOT_FOUND };
