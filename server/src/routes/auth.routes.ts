import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const authRoutes = Router();
const authController = new AuthController();

// User Registration
authRoutes.post("/register", authController.userRegistration);


export default authRoutes;