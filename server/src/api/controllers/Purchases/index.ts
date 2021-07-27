import { Router } from 'express';
import { Container, Service } from 'typedi';
import Bills from 'api/controllers/Purchases/Bills'
import BillPayments from 'api/controllers/Purchases/BillsPayments';
import BillAllocateLandedCost from './LandedCost';

@Service()
export default class PurchasesController {

  router() {
    const router = Router();

    router.use('/bills', Container.get(Bills).router());
    router.use('/bill_payments', Container.get(BillPayments).router());
    router.use('/landed-cost', Container.get(BillAllocateLandedCost).router());

    return router;
  }
}