import BaseController from '@/api/controllers/BaseController';
import { Router } from 'express';
import Container, { Service } from 'typedi';
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
