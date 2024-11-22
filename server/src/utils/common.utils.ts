import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUND = 10;
const salt = bcrypt.genSaltSync(SALT_ROUND);

// HTTP Status Codes
export const INTERNAL_ERROR = 500;
export const SERVICE_UNAVAILABLE = 503;
export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const FORBIDDEN = 403;
export const NOT_FOUND = 404;
export const CONFLICT = 409;
export const SUCCESS = 200;
export const CREATED = 201;

// HTTP Status Messages
export const INTERNAL_ERORR_MSG = 'Internal Server Erorr';
export const BAD_REQUEST_MSG = 'Bad Request';
export const NOT_FOUND_MSG= 'Not Found';
export const UNAUTHORIZED_MSG = 'Unautherised';
export const SUCCESS_MSG = 'Ok';
export const CREATED_MSG = 'Created';

// Hash Password
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, salt);
}

// Compare Password
export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);    
}

const TOKEN_SECRET = process.env.TOKEN_SECRET ?? 'secret';

// Generate Access Token
export const generateAccessToken = async (userId: string): Promise<string> => {
    return jwt.sign({ userId }, TOKEN_SECRET , { expiresIn: '1h' });
}

// Generate Refresh Token
export const generateRefreshToken = async (userId: string): Promise<string> => {
    return jwt.sign({ userId }, TOKEN_SECRET);
}