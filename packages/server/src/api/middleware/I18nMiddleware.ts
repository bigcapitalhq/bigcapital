import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { lowerCase } from 'lodash';

/**
 * Set the language from request `accept-language` header
*  or default application language.
 */
export default (req: Request, res: Response, next: NextFunction) => {
  const Logger = Container.get('logger');
  const I18n = Container.get('i18n');

  // Parses the accepted language from request object.
  const language = lowerCase(req.headers['accept-language']) || 'en';

  Logger.info('[i18n_middleware] set locale language to i18n.', {
    language,
    user: req.user,
  });
  // Initialise the global localization.
  I18n.init(req, res, next);
};
