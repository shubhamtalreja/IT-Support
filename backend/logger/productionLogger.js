const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] ${message}`;
});

const productionLogger = () => {
    return createLogger({
        level: 'info',
        format: combine(timestamp({ format: "DD-MM-YYYY HH:mm:ss" }), myFormat),
        transports: [
            new transports.Console(),
            new transports.File({ filename: 'error.log', level: 'error' }),
            new transports.File({ filename: 'combinedLog.log', level: 'info' })
        ]
    });
};

module.exports = productionLogger;