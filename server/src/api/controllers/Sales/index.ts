import { Router } from 'express';
import { Container, Service } from 'typedi';
import SalesEstimates from './SalesEstimates';
import SalesReceipts from './SalesReceipts';
import SalesInvoices from './SalesInvoices'
import PaymentReceives from './PaymentReceives';

@Service()
export default class SalesController {
  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    // router.use('/invoices', Container.get(SalesInvoices).router());
    router.use('/estimates', Container.get(SalesEstimates).router());
    router.use('/receipts', Container.get(SalesReceipts).router());
    // router.use('/payment_receives', Container.get(PaymentReceives).router());

    return router;
  }
}