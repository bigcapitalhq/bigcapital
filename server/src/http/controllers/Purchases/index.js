import express from 'express';
import Bills from '@/http/controllers/Purchases/Bills'
import BillPayments from '@/http/controllers/Purchases/BillsPayments';

export default {

  router() {
    const router = express.Router();

    router.use('/bills', Bills.router());
    router.use('/bill_payments', BillPayments.router());

    return router;
  }
}