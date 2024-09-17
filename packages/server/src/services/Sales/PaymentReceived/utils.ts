import {
  IPaymentReceived,
  PaymentReceivedPdfTemplateAttributes,
} from '@/interfaces';

export const transformPaymentReceivedToPdfTemplate = (
  payment: IPaymentReceived
): Partial<PaymentReceivedPdfTemplateAttributes> => {
  return {
    // ...payment
  };
};
