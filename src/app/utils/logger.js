import * as logger from 'winston';

const now = new Date();
const dateStr = now.toISOString();

if (process.env.NODE_ENV === 'development') {
  logger.configure({
    transports: [
      new logger.transports.Console(),
    ],
  });
} else {
  logger.configure({
    transports: [
      new (logger.transports.File)({ filename: `logs/${dateStr}.log` }),
    ],
  });
}

export default logger;
