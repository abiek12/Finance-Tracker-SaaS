import { IUser } from "../models/interfaces/user.interface";
import { UserResponseDto } from "../types/user.types";
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
  