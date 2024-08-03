import Container, { Inject, Service } from 'typedi';
import { Router } from 'express';
import BaseController from '@/api/controllers/BaseController';
import { PlaidBankingController } from './PlaidBankingController';
import { BankingRulesController } from './BankingRulesController';
import { BankTransactionsMatchingController } from './BankTransactionsMatchingController';
import { RecognizedTransactionsController } from './RecognizedTransactionsController';
import { BankAccountsController } from './BankAccountsController';
import { BankingUncategorizedController } from './BankingUncategorizedController';

@Service()
export class BankingController extends BaseController {
  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.use('/plaid', Container.get(PlaidBankingController).router());
    router.use('/rules', Container.get(BankingRulesController).router());
    router.use(
      '/matches',
      Container.get(BankTransactionsMatchingController).router()
    );
    router.use(
      '/recognized',
      Container.get(RecognizedTransactionsController).router()
    );
    router.use(
      '/bank_accounts',
      Container.get(BankAccountsController).router()
    );
    router.use(
      '/categorize',
      Container.get(BankingUncategorizedController).router()
    );
    return router;
  }
}
