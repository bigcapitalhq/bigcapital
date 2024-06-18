import Container, { Inject, Service } from 'typedi';
import { Router } from 'express';
import BaseController from '@/api/controllers/BaseController';
import { PlaidBankingController } from './PlaidBankingController';
import { BankingRulesController } from './BankingRulesController';

@Service()
export class BankingController extends BaseController {
  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.use('/plaid', Container.get(PlaidBankingController).router());
    router.use('/rules', Container.get(BankingRulesController).router());

    return router;
  }
}
