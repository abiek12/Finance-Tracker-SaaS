import bcrypt from 'bcryptjs';

const SALT_ROUND = 10;
const salt = bcrypt.genSaltSync(SALT_ROUND);

export class HttpStatus {
    INTERNAL_ERROR = 500;
    BAD_REQUEST = 400;
    NOT_FOUND = 404;
    UNAUTHORIZED = 401;
    CONFLICT = 409;
    SUCCESS = 200;
    CREATED = 201;
}

export class CommonMessages {
    INTERNAL_ERORR = 'Internal Server Erorr';
    BAD_REQUEST = 'Bad Request';
    NOT_FOUND = 'Not Found';
    UNAUTHORIZED = 'Unautherised';
    SUCCESS = 'Ok';
    CREATED = 'Created';
}

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, salt);
}