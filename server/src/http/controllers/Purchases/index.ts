import express from 'express';
import { Container } from 'typedi';
import Bills from '@/http/controllers/Purchases/Bills'
import BillPayments from '@/http/controllers/Purchases/BillsPayments';

export default {

  router() {
    const router = express.Router();

    router.use('/bills', Container.get(Bills).router());
    router.use('/bill_payments', Container.get(BillPayments).router());

    return router;
  }
}