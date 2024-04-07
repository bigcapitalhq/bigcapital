import { Router } from 'express';
import { Container, Service } from 'typedi';
import CreditNotes from './CreditNotes';
import PaymentReceives from './PaymentReceives';
import SalesEstimates from './SalesEstimates';
import SalesInvoices from './SalesInvoices';
import SalesReceipts from './SalesReceipts';
@Service()
export default class SalesController {
  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.use('/invoices', Container.get(SalesInvoices).router());
    router.use('/estimates', Container.get(SalesEstimates).router());
    router.use('/receipts', Container.get(SalesReceipts).router());
    router.use('/payment_receives', Container.get(PaymentReceives).router());
    router.use('/credit_notes', Container.get(CreditNotes).router());

    return router;
  }
}
