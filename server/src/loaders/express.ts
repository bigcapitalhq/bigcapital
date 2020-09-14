import { json, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import boom from 'express-boom';
import errorHandler from 'errorhandler';
import fileUpload from 'express-fileupload';
import i18n from 'i18n';
import routes from 'api';
import LoggerMiddleware from 'api/middleware/LoggerMiddleware';
import AgendashController from 'api/controllers/Agendash';
import config from 'config';

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
  app.use(json());

  // Handle multi-media requests.
  app.use(fileUpload({
    createParentPath: true,
  }));

  // Initialize i18n node.
  app.use(i18n.init);

  // Logger middleware.
  app.use(LoggerMiddleware);

  // Prefix all application routes.
  app.use(config.api.prefix, routes());

  // Agendash application load.
  app.use('/agendash', AgendashController.router());

  // catch 404 and forward to error handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    return res.boom.notFound();
  })
};