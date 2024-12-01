import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import fileRoutes from "./routes/file.routes";
import path from "path";
import { createUploadDirectory } from "./utils/common.utils";
import healthCheckRoutes from "./routes/healthCheck.routes";

dotenv.config();

// Create Express server
const app: Application = express();

// CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Specify allowed methods if needed
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};

// Set up static folder for serving files
const uploadsDirectory = path.join(__dirname, '../../server/src/uploads');

// Create uploads directory if not exists
createUploadDirectory(uploadsDirectory);

// Common Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDirectory));

// Routes
app.use("api/v1/health", healthCheckRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/file", fileRoutes);


export default app;