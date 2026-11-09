// Query key constants for payment link
export const PAYMENT_LINK_INVOICE = 'GetPaymentLinkInvoice';
export const PAYMENT_LINK_INVOICE_PDF = 'GetPaymentLinkInvoicePdf';

// Query key factory
export const paymentLinkKeys = {
  all: () => [PAYMENT_LINK_INVOICE] as const,
  invoice: (linkId: string) => [PAYMENT_LINK_INVOICE, linkId] as const,
  invoicePdf: (invoiceId: string) =>
    [PAYMENT_LINK_INVOICE_PDF, invoiceId] as const,
};

// Grouped object for use in components/hooks
export const PaymentLinkQueryKeys = {
  PAYMENT_LINK_INVOICE,
  PAYMENT_LINK_INVOICE_PDF,
} as const;
