import config from './config';
import logger from './app/utils/logger';
import app from './app/index';

// Init the express application
const server = app();

process.on('uncaughtException', (err) => {
  logger.error(`error: ${err}`);
});

// Start the app by listening on <port>
server.get('server').listen(config.port, config.hostname);

// Logging initialization
logger.info(`${config.app.title} started on ${config.hostname} : ${config.port} in ${config.env} mode on ${new Date().toISOString()}`);

export default app;
