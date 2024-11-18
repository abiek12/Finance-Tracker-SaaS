import { Logger } from "winston";
import { logType } from "../types/common.types";

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;

// Define a custom log format
const logFormat = printf(({ level, message, timestamp, stack }: logType) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create the logger
const logger: Logger = createLogger({
  level: 'info', // Default level
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // Handle errors properly
    logFormat
  ),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Error logs
    new transports.File({ filename: 'logs/combined.log' }) // All logs
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' }) // Uncaught exceptions
  ],
});

export default logger;
