import { Service, Inject } from 'typedi';
import { Request, Response, Router, NextFunction } from 'express';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BaseController from 'api/controllers/BaseController';
import AccountsTypesService from 'services/Accounts/AccountsTypesServices';

@Service()
export default class AccountsTypesController extends BaseController{
  @Inject()
  accountsTypesService: AccountsTypesService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get('/',
      asyncMiddleware(this.getAccountTypesList.bind(this))
    );
    return router;
  }

  /**
   * Retrieve accounts types list.
   */
  async getAccountTypesList(req: Request, res: Response, next: NextFunction) {
    const { tenantId, user } = req;

    try {
      const accountTypes = await this.accountsTypesService.getAccountsTypes(tenantId);
      return res.status(200).send({ account_types: accountTypes });
    } catch (error) {
      next(error);
    }
  }
};
