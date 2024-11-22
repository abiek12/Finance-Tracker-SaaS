import { Router } from "express";
import { UserControllers } from "../controllers/user.controller";

const userRoutes = Router();
const userController = new UserControllers();

// Get user details
userRoutes.get("/", userController.getUserDetails);
// Update user details
userRoutes.patch("/", userController.updateUserDetails);

export default userRoutes;