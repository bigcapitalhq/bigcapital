import { Router, Request, Response, NextFunction } from 'express';
import { Container, Service } from 'typedi';
import ItemsController from './Items';

import ItemTransactionsController from './ItemsTransactions';

@Service()
export default class ItemsBaseController {
  public router() {
    const router = Router();

    router.use('/', Container.get(ItemsController).router());
    router.use('/', Container.get(ItemTransactionsController).router());

    return router;
  }
}
