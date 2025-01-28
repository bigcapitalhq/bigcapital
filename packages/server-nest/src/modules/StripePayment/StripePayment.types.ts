export interface StripePaymentLinkCreatedEventPayload {
  paymentLinkId: string;
  saleInvoiceId: number;
  stripeIntegrationId: number;
}

export interface StripeCheckoutSessionCompletedEventPayload {
  event: any;
}

export interface StripeInvoiceCheckoutSessionPOJO {
  sessionId: string;
  publishableKey: string;
  redirectTo: string;
}

export interface StripeWebhookEventPayload {
  event: any;
}
