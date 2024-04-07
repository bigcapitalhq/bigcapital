import BaseController from '@/api/controllers/BaseController';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import AccountsTypesService from '@/services/Accounts/AccountsTypesServices';
import { NextFunction, Request, Response, Router } from 'express';
import { Inject, Service } from 'typedi';

@Service()
export default class AccountsTypesController extends BaseController {
  @Inject()
  accountsTypesService: AccountsTypesService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get('/', asyncMiddleware(this.getAccountTypesList.bind(this)));

    return router;
  }

  /**
   * Retrieve accounts types list.
   * @param {Request} req - Request.
   * @param {Response} res - Response.
   * @return {Response}
   */
  getAccountTypesList(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;

    try {
      const accountTypes = this.accountsTypesService.getAccountsTypes(tenantId);

      return res.status(200).send({
        account_types: this.transfromToResponse(accountTypes, ['label'], req),
      });
    } catch (error) {
      next(error);
    }
  }
}
