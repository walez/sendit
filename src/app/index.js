/**
 * Module dependencies.
 */

import http from 'http';
import path from 'path';

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import helmet from 'helmet';
import xss from 'xss-clean';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import logger from './utils/logger';
import config, { getGlobbedFiles } from '../config';

export default function () {
  // Initialize express app
  const app = express();

  // Passing the request url to environment locals
  app.use((req, res, next) => {
    if (config.app.url) {
      app.locals.url = `${config.app.url}:${config.port}`;
    } else {
      res.locals.url = `${req.protocol}://${req.headers.host}${req.url}`;
    }
    next();
  });

  // Showing stack errors
  app.set('showStackError', true);

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Enable logger (morgan)
    app.use(morgan('dev'));

    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(bodyParser.json());
  app.use(xss());
  app.use(methodOverride());

  // Use helmet to secure Express headers
  app.use(helmet({
    frameguard: false,
  }));
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.disable('x-powered-by');

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.removeHeader('X-Frame-Options');
    next();
  });

  if (config.toggle.apidoc) {
    const swaggerDocument = YAML.load(path.join(__dirname, '../../apidoc.yaml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  // Globbing routing files
  getGlobbedFiles('./routes/**/*.js').forEach((routePath) => {
    // require(path.resolve(routePath))(app);
    import(path.resolve(routePath)).then(routeModule => routeModule(app));
  });

  // Config Public Folder for Static Content
  app.use(express.static(path.join(__dirname, '../app/public')));

  // Assume 404 since no middleware responded
  app.use((req, res) => {
    logger.log('error', `Route Not Found - ${req.url}`, req.body || req.query);
    res.send(404);
  });

  const server = http.createServer(app);

  app.set('server', server);

  // Return Express server instance
  return app;
}
