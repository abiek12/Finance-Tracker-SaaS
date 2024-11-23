import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/user.interface";
import { UserRoles, UserStatus } from "../enums/user.enum";

const userSchema: Schema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Invalid email address.'] // Email validation
    },
    phone: {
        type: String,
        unique: true,
        default: null,
        match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Invalid phone number.'] // Phone number validation
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
        type: String,
        default: null
    },
    otpExpireTime: {
        type: Date,
        default: () => new Date(0)
    },
    oauthProvider: {
        type: String,
        default: null
    },
    oauthId: {
        type: String,
        default: null
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: 0
    },
    lastLogin: {
        type: Date,
        default: null
    },
    profilePicture: {
        type: String,
        default: null
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    role: {
        type: String,
        enum: UserRoles,
        default: UserRoles.USER
    },
    status: {
        type: String,
        enum: UserStatus,
        default: UserStatus.ACTIVE
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


// Pre-save middleware to auto-update the `updatedAt` field
userSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

// INDEXES
// Single Field Indexes
userSchema.index({isDeleted: 1});
userSchema.index({status: 1});

// Sorting indexes
userSchema.index({createdAt: 1});

// compound indexes
userSchema.index({ oauthProvider: 1, oauthId: 1 }); // For OAuth lookups (compound index)
userSchema.index({ otp: 1, otpExpireTime: 1 }); // For OTP validation with expiry time (compound index)

export const User = mongoose.model<IUser & Document>('User', userSchema);