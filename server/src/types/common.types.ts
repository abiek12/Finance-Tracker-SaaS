export type logType = {
    level: string;
    message: string;
    timestamp: string;
    stack?: string;
};

export type tokenType = {
    verificationToken: string;
    verificationTokenExpires: Date;
};