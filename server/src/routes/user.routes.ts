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

export default userRoutes;