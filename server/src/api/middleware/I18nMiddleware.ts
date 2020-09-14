import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import i18n from 'i18n';

export default (req: Request, res: Response, next: NextFunction) => {
  const Logger = Container.get('logger');
  let language = req.headers['accept-language'] || 'en';

  if (req.user && req.user.language) {
    language = req.user.language;
  }
  Logger.info('[i18n_middleware] set locale language to i18n.', { language, user: req.user });
  i18n.setLocale(req, language);
  next();
};