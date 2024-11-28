import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import fileRoutes from "./routes/file.routes";
import path from "path";

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
const uploadsDirectory = path.join(process.cwd(), 'uploads');

// Common Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(uploadsDirectory));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/file", fileRoutes);


export default app;