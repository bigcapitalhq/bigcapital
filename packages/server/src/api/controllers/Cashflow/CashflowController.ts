import { Router } from 'express';
import { Container, Service } from 'typedi';
import DeleteCashflowTransaction from './DeleteCashflowTransaction';
import GetCashflowAccounts from './GetCashflowAccounts';
import GetCashflowTransaction from './GetCashflowTransaction';
import CommandCashflowTransaction from './NewCashflowTransaction';

@Service()
export default class CashflowController {
  /**
   * Constructor method.
   */
  router() {
    const router = Router();

    router.use(Container.get(CommandCashflowTransaction).router());
    router.use(Container.get(GetCashflowTransaction).router());
    router.use(Container.get(GetCashflowAccounts).router());
    router.use(Container.get(DeleteCashflowTransaction).router());

    return router;
  }
}
