import { Request, Response } from 'express';
import { INTERNAL_ERROR, SUCCESS } from '../utils/common.utils';
import { errorResponse, successResponse } from '../utils/responseHandler.utils';
import logger from '../utils/logger.utils';

export class FileController {
    // Upload file
    uploadFile = async (req: Request, res: Response) => {
        try {
            if(!req.file) {
                res.status(INTERNAL_ERROR).send(errorResponse(INTERNAL_ERROR, "No file uploaded"));
                return;
            }
            // Generate file URL
            const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

            logger.info("FILE-CONTROLLER:: File uploaded successfully");
            res.status(SUCCESS).send(successResponse(SUCCESS, "File uploaded successfully", fileUrl))
        } catch (error) {
            console.error("FILE-CONTROLLER:: Error occurred while uploading file", error);
            res.status(INTERNAL_ERROR).send(errorResponse(INTERNAL_ERROR, "Error occurred while uploading file"));
        }
    }
}