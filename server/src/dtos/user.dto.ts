import { IUser } from "../models/interfaces/user.interface";

export interface UserResponseDto {
  id: string;
  userName: string;
  email: string;
  isEmailVerified: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const mapToUserResponse = (user: IUser): UserResponseDto => {
  return {
      id: user._id,
      userName: user.userName,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
  };
}
  