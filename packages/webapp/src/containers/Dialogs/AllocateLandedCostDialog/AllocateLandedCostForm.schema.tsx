// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';

export const AllocateLandedCostFormSchema = () =>
  Yup.object().shape({
    transaction_type: Yup.string().label(intl.get('transaction_type')),
    transaction_date: Yup.date().label(intl.get('transaction_date')),
    transaction_id: Yup.string().label(intl.get('transaction_number')),
    transaction_entry_id: Yup.string().label(intl.get('transaction_line')),
    amount: Yup.number().label(intl.get('amount')),
    allocation_method: Yup.string().trim(),
    items: Yup.array().of(
      Yup.object().shape({
        entry_id: Yup.number().nullable(),
        cost: Yup.number().nullable(),
      }),
    ),
  });
