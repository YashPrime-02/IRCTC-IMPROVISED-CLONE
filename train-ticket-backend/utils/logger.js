// const { createLogger, format, transports } = require('winston');
// const { combine, timestamp, printf, colorize } = format;

// const logFormat = printf(({ timestamp, level, message }) => {
//   return `[${timestamp}] ${level}: ${message}`;
// });

// const logger = createLogger({
//   level: 'info',
//   format: combine(
//     timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//     logFormat 
//   ),
//   transports: [
    
//     new transports.Console({
//       format: combine(
//         colorize({ all: true }), 
//         timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//         logFormat
//       )
//     }),

//     new transports.File({ filename: 'logs/combined.log' }),

//     new transports.File({ filename: 'logs/error.log', level: 'error' }),
//   ]
// });

// module.exports = logger;
