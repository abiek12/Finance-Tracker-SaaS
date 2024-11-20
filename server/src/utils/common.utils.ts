import bcrypt from 'bcryptjs';

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