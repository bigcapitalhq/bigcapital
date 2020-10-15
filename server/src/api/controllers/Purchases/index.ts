import { Router } from 'express';
import { Container, Service } from 'typedi';
import Bills from 'api/controllers/Purchases/Bills'
import BillPayments from 'api/controllers/Purchases/BillsPayments';

@Service()
export default class PurchasesController {

  router() {
    const router = Router();

    router.use('/bills', Container.get(Bills).router());
    router.use('/bill_payments', Container.get(BillPayments).router());

    return router;
  }
}