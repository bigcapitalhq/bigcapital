import { oidcClient } from '@/lib/Oidc/OidcClient';
import { NextFunction, Request, Response } from 'express';

const oidcSessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.token;

  try {
    const oidcAccessToken = token.oidc_access_token;

    if (oidcAccessToken) {
      const introspectionResponse = await oidcClient.introspect(
        oidcAccessToken
      );
      if (!introspectionResponse.active) {
        return res.boom.unauthorized();
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
export default oidcSessionMiddleware;
