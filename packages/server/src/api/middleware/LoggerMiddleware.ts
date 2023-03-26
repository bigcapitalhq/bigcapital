import { NextFunction, Request } from 'express';
import { Container } from 'typedi';

function loggerMiddleware(request: Request, response: Response, next: NextFunction) {
  const Logger = Container.get('logger');

  Logger.info(`[routes] ${request.method} ${request.path}`);
  next();
}

export default loggerMiddleware;
