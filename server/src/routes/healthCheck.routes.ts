import { Router } from "express";
import { SERVICE_UNAVAILABLE, SUCCESS } from "../utils/common.utils";
import { errorResponse, successResponse } from "../utils/responseHandler.utils";

const healthCheckRoutes = Router();

healthCheckRoutes.get("/", (req, res) => {
    try {
        const health = {
            uptime: process.uptime(),
            timestamp: Date.now(),
            status: "OK",
            version: process.env.npm_package_version || "1.0.0"
        }
        res.status(SUCCESS).send(successResponse(SUCCESS, health, "Server is up and running!"));
    } catch (error) {
        res.status(SERVICE_UNAVAILABLE).send(errorResponse(SERVICE_UNAVAILABLE, "Server is down!"));
    }
});

export default healthCheckRoutes;