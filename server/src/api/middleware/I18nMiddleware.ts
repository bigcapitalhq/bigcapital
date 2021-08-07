import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { lowerCase } from 'lodash';
import i18n from 'i18n';

/**
 * Set the language from request `accept-language` header
*  or default application language.
 */
export default (req: Request, res: Response, next: NextFunction) => {
  const Logger = Container.get('logger');

  // Parses the accepted language from request object.
  const language = lowerCase(req.headers['accept-language']) || 'en';

  Logger.info('[i18n_middleware] set locale language to i18n.', {
    language,
    user: req.user,
  });
  i18n.setLocale(req, language);

  next();
};
