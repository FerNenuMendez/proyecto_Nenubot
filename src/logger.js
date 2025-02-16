import { createLogger, format, transports } from 'winston';
import path from 'path';

const { combine, timestamp, printf, errors } = format;

// Formato del mensaje del log
const formatoLog = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});


const logDir = path.resolve('./src/logs');

const logger = createLogger({
    format: combine(
        format.colorize(),
        timestamp({ format: 'DD-MM-YY HH:mm' }),
        errors({ stack: true }),
        formatoLog
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: path.join(logDir, 'app.log') })
    ],
    exceptionHandlers: [
        new transports.File({ filename: path.join(logDir, 'exceptions.log') })
    ]
});

export default logger;