import BaseController from '@/api/controllers/BaseController';
import AttachCurrentTenantUser from '@/api/middleware/AttachCurrentTenantUser';
import TenancyMiddleware from '@/api/middleware/TenancyMiddleware';
import JWTAuth from '@/api/middleware/jwtAuth';
import { OidcService } from '@/services/Oidc';
import { NextFunction, Request, Response, Router } from 'express';
import { Inject, Service } from 'typedi';
@Service()
export default class OidcController extends BaseController {
  @Inject()
  private oidcService: OidcService;

  /**
   * Router constructor method.
   */
  public router() {
    const router = Router();

    router.post('/authorize', this.authorize);

    router.post('/login', this.oidcLogin);

    router.use(JWTAuth);
    router.use(AttachCurrentTenantUser);
    router.use(TenancyMiddleware);

    router.post('/logout', this.oidcLogout);

    return router;
  }

  /**
   * Authentication Oidc authorize.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private authorize = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authorizationUrl = this.oidcService.generateAuthorizationUrl();

      res.json({ authorizationUrl });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Authentication oidc login.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private oidcLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const code = req.body.code;

      const loginResponse = await this.oidcService.loginUser(code);

      return res.status(200).send(loginResponse);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Authentication oidc logout.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private oidcLogout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { token } = req;

      const oidcIdToken = token.oidc_id_token;
      const oidcAccessToken = token.oidc_access_token;

      const logoutUrl = await this.oidcService.generateEndSessionUrl({
        oidcIdToken,
        oidcAccessToken,
      });

      return res.status(200).send({ logoutUrl });
    } catch (error) {
      next(error);
    }
  };
}
