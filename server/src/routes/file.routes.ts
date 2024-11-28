import { Router } from "express";

const fileRoutes = Router();

// Routes for file upload
fileRoutes.post("/upload", upload.single("file"), fileController.uploadFile);