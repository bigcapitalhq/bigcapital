import { Router, Request, Response, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import BaseController from '@/api/controllers/BaseController';
import AuthenticatedAccount from '@/services/AuthenticatedAccount';
import TenancyMiddleware from '@/api/middleware/TenancyMiddleware';
import AttachCurrentTenantUser from '@/api/middleware/AttachCurrentTenantUser';
import JWTAuth from '@/api/middleware/jwtAuth';

@Service()
export default class AccountController extends BaseController {
  @Inject()
  accountService: AuthenticatedAccount;

  /**
   * Router constructor method.
   */
  public router() {
    const router = Router();

    // Should before build tenant database the user be authorized and
    // most important than that, should be subscribed to any plan.
    router.use(JWTAuth);
    router.use(AttachCurrentTenantUser);
    router.use(TenancyMiddleware);

    router.get('/', this.getAccount);

    return router;
  }

  /**
   * Creates a new account.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private getAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId, user } = req;

    try {
      const account = await this.accountService.getAccount(tenantId, user);

      return res.status(200).send({ data: account });
    } catch (error) {
      next(error);
    }
  };
}
