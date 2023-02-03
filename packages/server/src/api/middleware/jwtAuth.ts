import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '@/config';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const Logger = Container.get('logger');
  const token = req.headers['x-access-token'] || req.query.token;

  const onError = () => {
    Logger.info('[auth_middleware] jwt verify error.');
    res.boom.unauthorized();
  };
  const onSuccess = (decoded) => {
    req.token = decoded;
    Logger.info('[auth_middleware] jwt verify success.');
    next();
  };
  if (!token) { return onError(); }

  const verify = new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtSecret, async (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        resolve(decoded);
      }
    });
  });
  verify.then(onSuccess).catch(onError);
};
export default authMiddleware;
