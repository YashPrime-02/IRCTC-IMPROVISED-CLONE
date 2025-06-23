const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ timestamp, level, message }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat // 📝 this will be overridden by colorize in console
  ),
  transports: [
    // 🌈 Terminal logs with color
    new transports.Console({
      format: combine(
        colorize({ all: true }), // ✅ enable color for everything
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      )
    }),

    // 📝 All logs in file (no color)
    new transports.File({ filename: 'logs/combined.log' }),

    // ❌ Only error logs in file
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ]
});

module.exports = logger;
