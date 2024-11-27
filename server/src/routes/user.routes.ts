import { Router } from "express";
import { UserControllers } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const userRoutes = Router();
const userController = new UserControllers();

// Get user details
userRoutes.get("/", verifyToken, userController.getUserDetails);
// Update user details
userRoutes.patch("/", verifyToken, userController.updateUserDetails);
// Send verification email
userRoutes.get("/send-verification-email", verifyToken, userController.sendVerificationEmail);
// User Email Verification
userRoutes.get("/verify-email", userController.userVerification);
// Forgot password
userRoutes.post("/forgot-password", userController.forgotPassword);
// Reset password with login
userRoutes.post("/reset-password", verifyToken, userController.resetPassword);
// Reset password without login
userRoutes.post("/reset-password/:token", userController.resetPassword);

export default userRoutes;