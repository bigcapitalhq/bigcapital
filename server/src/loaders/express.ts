import express from 'express';
import helmet from 'helmet';
import boom from 'express-boom';
import errorHandler from 'errorhandler';
import i18n from 'i18n';
import fileUpload from 'express-fileupload';
import routes from '@/http';

export default ({ app }) => {
  // Express configuration.
  app.set('port', 3000);

  app.use(helmet());
  app.use(errorHandler());
  app.use(boom());
  app.use(express.json());
  app.use(fileUpload({
    createParentPath: true,
  }));
  routes(app);
};