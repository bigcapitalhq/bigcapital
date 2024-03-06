// @ts-nocheck
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  amount: Yup.string().required().label('Amount'),
  exchangeRate: Yup.string().required().label('Exchange rate'),
  transactionType: Yup.string().required().label('Transaction type'),
  date: Yup.string().required().label('Date'),
  creditAccountId: Yup.string().required().label('Credit account'),
  referenceNo: Yup.string().optional().label('Reference No.'),
  description: Yup.string().optional().label('Description'),
});

export const CreateCategorizeTransactionSchema = Schema;
