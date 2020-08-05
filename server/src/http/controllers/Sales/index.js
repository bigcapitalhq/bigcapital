import express from 'express';
import SalesEstimates from './SalesEstimates';
import SalesReceipts from './SalesReceipts';
import SalesInvoices from './SalesInvoices'
import PaymentReceives from './PaymentReceives';

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.use('/invoices', SalesInvoices.router());
    router.use('/estimates', SalesEstimates.router());
    router.use('/receipts', SalesReceipts.router());
    router.use('/payment_receives', PaymentReceives.router());

    return router;
  }
}