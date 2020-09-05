import express from 'express';
import helmet from 'helmet';
import boom from 'express-boom';
import errorHandler from 'errorhandler';
import fileUpload from 'express-fileupload';
import i18n from 'i18n';
import routes from '@/http';
import config from '@/../config/config';

export default ({ app }) => {
  // Express configuration.
  app.set('port', 3000);

  // Helmet helps you secure your Express apps by setting various HTTP headers.
  app.use(helmet());

  // Allow to full error stack traces and internal details 
  app.use(errorHandler());

  // Boom response objects.
  app.use(boom());

  // Parses both json and urlencoded.
  app.use(express.json());

  // Handle multi-media requests.
  app.use(fileUpload({
    createParentPath: true,
  }));

  // Initialize i18n node.
  app.use(i18n.init)

  // Prefix all application routes.
  app.use(config.api.prefix, routes());

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  })
};