import { Service } from 'typedi';
import { Request, Response, Router } from 'express';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import BaseController from '@/http/controllers/BaseController';

@Service()
export default class AccountsTypesController extends BaseController{
  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get('/',
      asyncMiddleware(this.getAccountTypesList));

    return router;
  }

  /**
   * Retrieve accounts types list.
   */
  async getAccountTypesList(req: Request, res: Response) {
    const { AccountType } = req.models;
    const accountTypes = await AccountType.query();

    return res.status(200).send({
      account_types: accountTypes,
    });
  }
};
