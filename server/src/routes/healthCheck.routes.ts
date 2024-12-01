import { Router } from "express";
import { SUCCESS } from "../utils/common.utils";
import { successResponse } from "../utils/responseHandler.utils";

const healthCheckRoutes = Router();

healthCheckRoutes.get("/", (req, res) => {
    res.status(SUCCESS).send(successResponse(SUCCESS, "Server is up and running!"))
});

export default healthCheckRoutes;