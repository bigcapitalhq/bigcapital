import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '@/config';
import { OidcService } from '@/services/Oidc';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const Repositories = Container.get('repositories');
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
  if (!token) { return onError();}

  const verifyOidcAccessToken = async () => {
    try {
      const oidcService = new OidcService();

      const introspectResponse = await oidcService.introspectAccessToken(token);

      if (!introspectResponse.active)
        throw new Error(`Invalid access token: ${token}`);

      const { systemUserRepository } = Repositories;

      const email = introspectResponse.email;

      const systemUser = await systemUserRepository.findOneByEmail(email);

      const payload = {
        id: systemUser.id,
        oidc_access_token: token,
        exp: introspectResponse.exp,
      };

      onSuccess(payload);
    } catch (error) {
      onError();
    }
  };

  const verify = new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtSecret, async (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        resolve(decoded);
      }
    });
  });
  verify.then(onSuccess).catch(verifyOidcAccessToken);
};
export default authMiddleware;
