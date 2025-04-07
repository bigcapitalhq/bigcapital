export interface SubscriptionPayload {
  lemonSqueezyId?: string;
}

export enum SubscriptionPaymentStatus {
  Succeed = 'succeed',
  Failed = 'failed',
}
