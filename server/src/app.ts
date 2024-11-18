import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";

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

// Common Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes


export default app;