import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  date: Yup.date().required().label(intl.get('date')),
  amount: Yup.number().required().label(intl.get('amount')),
  transaction_number: Yup.string(),
  reference_no: Yup.string(),
  account_id: Yup.number().required(),
  equity_account_id: Yup.string()
    .required()
    .label(intl.get('cash_flow_transaction.label_equity_account')),
  description: Yup.string()
    .min(3)
    .max(DATATYPES_LENGTH.TEXT)
    .label(intl.get('description')),
  published: Yup.boolean(),
});

export const CreateOwnerDrawingsFormSchema = Schema;
