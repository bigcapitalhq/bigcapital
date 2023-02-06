import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

export default (
  fn: (rq: Request, rs: Response, next?: NextFunction) => {}) =>
  (req: Request, res: Response, next: NextFunction) => {
  const Logger = Container.get('logger');

  Promise.resolve(fn(req, res, next))
    .catch((error) => {
      Logger.error('[async_middleware] error.', { error });
      next(error);
    });
};