import { Router } from 'express';
import { Container, Service } from 'typedi';
import Bills from '@/api/controllers/Purchases/Bills';
import BillPayments from '@/api/controllers/Purchases/BillsPayments';
import BillAllocateLandedCost from './LandedCost';
import VendorCredit from './VendorCredit';
import VendorCreditApplyToBills from './VendorCreditApplyToBills';

@Service()
export default class PurchasesController {
  router() {
    const router = Router();

    router.use('/bills', Container.get(Bills).router());
    router.use('/bill_payments', Container.get(BillPayments).router());
    router.use('/landed-cost', Container.get(BillAllocateLandedCost).router());
    router.use('/vendor-credit', Container.get(VendorCredit).router());
    router.use(
      '/vendor-credit',
      Container.get(VendorCreditApplyToBills).router()
    );

    return router;
  }
}
