import * as Yup from 'yup';
import intl from 'react-intl-universal';

export const AllocateLandedCostFormSchema = (maxAmount) =>
  Yup.object().shape({
    transaction_type: Yup.string()
      .required()
      .label(intl.get('transaction_type')),
    transaction_id: Yup.string()
      .required()
      .label(intl.get('transaction_number')),
    transaction_entry_id: Yup.string()
      .required()
      .label(intl.get('transaction_line')),
    amount: Yup.number().max(maxAmount).label(intl.get('amount')),
    allocation_method: Yup.string().required().trim(),
    items: Yup.array().of(
      Yup.object().shape({
        entry_id: Yup.number().nullable(),
        cost: Yup.number().nullable(),
      }),
    ),
  });
