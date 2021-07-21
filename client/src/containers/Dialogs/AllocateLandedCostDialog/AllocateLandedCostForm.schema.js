import * as Yup from 'yup';
import intl from 'react-intl-universal';

const Schema = Yup.object().shape({
  transaction_type: Yup.string().label(intl.get('transaction_type')),
  transaction_date: Yup.date().label(intl.get('transaction_date')),
  transaction_id: Yup.string().label(intl.get('transaction_number')),
  transaction_entry_id: Yup.string().label(intl.get('transaction_line')),
  amount: Yup.number().label(intl.get('amount')),
  allocation_method: Yup.string().trim(),
  entries: Yup.array().of(
    Yup.object().shape({
      entry_id: Yup.number().nullable(),
      cost: Yup.number().nullable(),
    }),
  ),
});

export const AllocateLandedCostFormSchema = Schema;
