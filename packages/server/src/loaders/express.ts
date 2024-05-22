import { json, Request, Response, NextFunction } from 'express';
import express from 'express';
import helmet from 'helmet';
import boom from 'express-boom';
import errorHandler from 'errorhandler';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import Container from 'typedi';
import routes from 'api';
import LoggerMiddleware from '@/api/middleware/LoggerMiddleware';
import AgendashController from '@/api/controllers/Agendash';
import ConvertEmptyStringsToNull from '@/api/middleware/ConvertEmptyStringsToNull';
import RateLimiterMiddleware from '@/api/middleware/RateLimiterMiddleware';
import {
  JSONResponseTransformer,
  snakecaseResponseTransformer,
} from '@/api/middleware/JSONResponseTransformer';
import config from '@/config';
import path from 'path';
import { ObjectionErrorException } from '@/api/exceptions/ObjectionErrorException';
import { ServiceErrorException } from '@/api/exceptions/ServiceErrorException';
import { GlobalErrorException } from '@/api/exceptions/GlobalErrorException';

export default ({ app }) => {
  // Express configuration.
  app.set('port', 3000);

  // Template engine configuration.
  app.set('views', path.join(__dirname, '../resources/views'));
  app.set('view engine', 'pug');

  // Helmet helps you secure your Express apps by setting various HTTP headers.
  app.use(helmet());

  // Boom response objects.
  app.use(boom());

  app.use(
    bodyParser.json({
      verify: (req, res, buf) => {
        req.rawBody = buf;
      },
    })
  );

  // Parses both json and urlencoded.
  app.use(json());

  // Middleware for intercepting and transforming json responses.
  app.use(JSONResponseTransformer(snakecaseResponseTransformer));

  app.use('/public', express.static(path.join(global.__storage_dir)));

  // Logger middleware.
  app.use(LoggerMiddleware);

  // Converts empty strings to null of request body.
  app.use(ConvertEmptyStringsToNull);

  // Prefix all application routes.
  app.use(config.api.prefix, RateLimiterMiddleware);
  app.use(config.api.prefix, routes());

  // Agendash application load.
  app.use('/agendash', AgendashController.router());

  // Handles errors.
  app.use(ObjectionErrorException);
  app.use(ServiceErrorException);
  app.use(GlobalErrorException);

  // catch 404 and forward to error handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    return res.boom.notFound();
  });
  const server = app.listen(app.get('port'), (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
      return;
    }
    console.log(`
      ################################################
        Server listening on port: ${app.get('port')}
      ################################################
    `);
  });
  const io = new Server(server, { path: '/socket' });

  // Set socket.io listeners.
  io.on('connection', (socket) => {
    console.log('SOCKET CONNECTED');

    socket.on('disconnect', () => {
      console.log('SOCKET DISCONNECTED');
    });
  });
  // Middleware to pass socket to each request object.
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.io = io;
    next();
  });
  Container.set('socket', io);
};
