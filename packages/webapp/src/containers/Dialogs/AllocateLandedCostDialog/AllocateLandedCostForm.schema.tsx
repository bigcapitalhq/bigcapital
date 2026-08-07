import intl from 'react-intl-universal';
import * as Yup from 'yup';

export const AllocateLandedCostFormSchema = () =>
  Yup.object().shape({
    transactionType: Yup.string().label(intl.get('transaction_type')),
    transactionDate: Yup.date().label(intl.get('transaction_date')),
    transactionId: Yup.string().label(intl.get('transaction_number')),
    transactionEntryId: Yup.string().label(intl.get('transaction_line')),
    amount: Yup.number().label(intl.get('amount')),
    allocationMethod: Yup.string().trim(),
    items: Yup.array().of(
      Yup.object().shape({
        entryId: Yup.number().nullable(),
        cost: Yup.number().nullable(),
      }),
    ),
  });
