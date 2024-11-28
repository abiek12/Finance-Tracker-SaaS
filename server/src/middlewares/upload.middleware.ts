import multer from 'multer';
import path from 'path';
import { createUploadDirectory } from '../utils/common.utils';

const uploadsDirectory = path.join(__dirname, '../../src/uploads');
// Create uploads directory if not exists
createUploadDirectory(uploadsDirectory);

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDirectory);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

// File validations
const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// file size limit
const limits = {
    fileSize: 5 * 1024 * 1024, // 5 MB
}

export const upload = multer({ storage, fileFilter, limits });