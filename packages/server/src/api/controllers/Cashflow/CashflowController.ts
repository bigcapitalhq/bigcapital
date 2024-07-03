import { Service, Inject, Container } from 'typedi';
import { Router } from 'express';
import CommandCashflowTransaction from './NewCashflowTransaction';
import DeleteCashflowTransaction from './DeleteCashflowTransaction';
import GetCashflowTransaction from './GetCashflowTransaction';
import GetCashflowAccounts from './GetCashflowAccounts';
import { ExcludeBankTransactionsController } from '../Banking/ExcludeBankTransactionsController';

@Service()
export default class CashflowController {
  /**
   * Constructor method.
   */
  router() {
    const router = Router();

    router.use(Container.get(CommandCashflowTransaction).router());
    router.use(Container.get(ExcludeBankTransactionsController).router());
    router.use(Container.get(GetCashflowTransaction).router());
    router.use(Container.get(GetCashflowAccounts).router());
    router.use(Container.get(DeleteCashflowTransaction).router());

    return router;
  }
}
