const logger = require('../utils/logger');

// ✅ Logs each incoming HTTP request for debugging/tracking
module.exports = (req, res, next) => {
  const { method, originalUrl, ip } = req;
  const userAgent = req.get('User-Agent');

  logger.info(`📡 ${method} ${originalUrl} | IP: ${ip} | Agent: ${userAgent}`);
  next(); // move to the next middleware/route
};
