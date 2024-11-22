import { Router } from "express";
import { UserControllers } from "../controllers/user.controller";

const userRoutes = Router();
const userController = new UserControllers();

// Get user details
userRoutes.get("/", userController.getUserDetails);

export default userRoutes;