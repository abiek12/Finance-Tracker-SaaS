import { Router } from "express";
import { upload } from "../middlewares/upload.middleware";
import { FileController } from "../controllers/file.controller";

const fileRoutes = Router();
const fileController = new FileController();

// Routes for file upload
fileRoutes.post("/uploads", upload.single("file"), fileController.uploadFile);

export default fileRoutes;