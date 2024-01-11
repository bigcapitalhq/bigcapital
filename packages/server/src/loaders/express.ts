import { json, Request, Response, NextFunction } from 'express';
import express from 'express';
import helmet from 'helmet';
import boom from 'express-boom';
import errorHandler from 'errorhandler';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
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
import ObjectionErrorHandlerMiddleware from '@/api/middleware/ObjectionErrorHandlerMiddleware';

export default ({ app }) => {
  // Express configuration.
  app.set('port', 3000);

  // Template engine configuration.
  app.set('views', path.join(__dirname, '../resources/views'));
  app.set('view engine', 'pug');

  // Helmet helps you secure your Express apps by setting various HTTP headers.
  app.use(helmet());

  // Allow to full error stack traces and internal details
  app.use(errorHandler());

  // Boom response objects.
  app.use(boom());

  app.use(bodyParser.json());

  // Parses both json and urlencoded.
  app.use(json());

  // Middleware for intercepting and transforming json responses.
  app.use(JSONResponseTransformer(snakecaseResponseTransformer));

  app.use('/public', express.static(path.join(global.__storage_dir)));

  // Handle multi-media requests.
  app.use(
    fileUpload({
      createParentPath: true,
    })
  );

  // Logger middleware.
  app.use(LoggerMiddleware);

  // Converts empty strings to null of request body.
  app.use(ConvertEmptyStringsToNull);

  // Prefix all application routes.
  app.use(config.api.prefix, RateLimiterMiddleware);
  app.use(config.api.prefix, routes());

  // Agendash application load.
  app.use('/agendash', AgendashController.router());

  // Handles objectionjs errors.
  app.use(ObjectionErrorHandlerMiddleware);

  // catch 404 and forward to error handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    return res.boom.notFound();
  });
};
