import { tokenType } from "../../types/common.types";
import { UserRegData } from "../../types/user.types";
import { UserStatus } from "../enums/user.enum";
import { IUser } from "../interfaces/user.interface";
import { User } from "../schemas/user.schema";

export class UserRepository {
    createUser = async (userDetails: UserRegData): Promise<IUser> => {
        return await new User(userDetails).save();
    }

    findAllUsers = async (): Promise<IUser[]> => {
        return await User.find();
    }

    findUserByEmail = async (email: string): Promise<IUser | null> => {
        return await User.findOne({
            email
        });
    }

    findUserByPhone = async (phone: string): Promise<IUser | null> => {
        return await User.findOne({
            phone
        });
    }

    findUserById = async (id: string): Promise<IUser | null> => {
        return await User.findById(id);
    }

    updateUserById = async (id: string, userDetails: IUser): Promise<IUser | null> => {
        return await User.findByIdAndUpdate(id, userDetails, {
            new: true
        });
    }

    deleteUserById = async (id: string): Promise<IUser | null> => {
        return await User.findByIdAndDelete(id);
    }

    updateUserLastLogin = async (id: string): Promise<void> => {
        await User.findByIdAndUpdate(id, { lastLogin: new Date()})
    }

    setVerificationToken = async (id: string, data: tokenType): Promise<void> => {
        await User.findByIdAndUpdate(id, {
            verificationToken: data.verificationToken,
            verificationTokenExpires: data.verificationTokenExpires
        });
    }

    updateUserStatus = async (id: string, status: UserStatus): Promise<void> => {
        await User.findByIdAndUpdate(id, {
            status
        });
    }
}