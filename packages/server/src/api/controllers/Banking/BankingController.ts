import Container, { Inject, Service } from 'typedi';
import { Router } from 'express';
import BaseController from '@/api/controllers/BaseController';
import { PlaidBankingController } from './PlaidBankingController';

@Service()
export class BankingController extends BaseController {
  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.use('/plaid', Container.get(PlaidBankingController).router());

    return router;
  }
}
