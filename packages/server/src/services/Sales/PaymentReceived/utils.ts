import {
  IPaymentReceived,
  PaymentReceivedPdfTemplateAttributes,
} from '@/interfaces';

export const transformPaymentReceivedToPdfTemplate = (
  payment: IPaymentReceived
): Partial<PaymentReceivedPdfTemplateAttributes> => {
  return {
    total: payment.formattedAmount,
    subtotal: payment.subtotalFormatted,
    paymentReceivedNumebr: payment.paymentReceiveNo,
    paymentReceivedDate: payment.formattedPaymentDate,
    customerName: payment.customer.displayName,
    lines: payment.entries.map((entry) => ({
      invoiceNumber: entry.invoice.invoiceNo,
      invoiceAmount: entry.invoice.totalFormatted,
      paidAmount: entry.paymentAmountFormatted,
    })),
  };
};
