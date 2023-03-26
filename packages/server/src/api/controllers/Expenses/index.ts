
import { Router } from 'express';
import { Container, Service } from 'typedi';
import { ExpensesController } from './Expenses';

@Service()
export default class ExpensesBaseController {
  router() {
    const router = Router();

    router.use('/', Container.get(ExpensesController).router());

    return router;
  }
}
