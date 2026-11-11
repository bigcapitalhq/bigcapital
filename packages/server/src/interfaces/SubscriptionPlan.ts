export interface SubscriptionPayload {
  stripeSubscriptionId?: string;
}

export enum SubscriptionPaymentStatus {
  Succeed = 'succeed',
  Failed = 'failed',
}
