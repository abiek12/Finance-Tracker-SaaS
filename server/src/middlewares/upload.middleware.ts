import multer from 'multer';
import path from 'path';
import { createUploadDirectory } from '../utils/common.utils';

const uploadsDirectory = path.join(process.cwd(), '../../server/src/uploads');
createUploadDirectory(uploadsDirectory);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDirectory);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

export const upload = multer({ storage: storage });