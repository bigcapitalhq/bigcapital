import * as Yup from 'yup';

export const SharePaymentLinkFormSchema = Yup.object().shape({
  publicity: Yup.string()
    .oneOf(['private', 'public'], 'Invalid publicity type')
    .required('Publicity is required'),
  expiryDate: Yup.date()
    .nullable()
    .required('Expiration date is required')
    .min(new Date(), 'Expiration date must be in the future'),
  transactionId: Yup.string()
    .required('Transaction ID is required'),
  transactionType: Yup.string()
    .required('Transaction type is required'),
});
