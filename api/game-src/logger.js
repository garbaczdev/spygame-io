const winston = require('winston');

// Define custom formats
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const prettyFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);

// Create logger
const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: prettyFormat,
    }),
    new winston.transports.File({
      filename: 'app.log',
      format: jsonFormat,
    }),
  ],
});

module.exports = { logger };
