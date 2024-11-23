import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const userSchema: Schema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    twoFA: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    otpExpireTime: {
        type: Date
    },
    oauthProvider: {
        type: String
    },
    oauthId: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export const User = mongoose.model<IUser & Document>('User', userSchema);