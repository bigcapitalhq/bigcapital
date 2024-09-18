

export interface StripePaymentLinkCreatedEventPayload {
  tenantId: number;
  paymentLinkId: string;
  saleInvoiceId: number;
  stripeIntegrationId: number;
}