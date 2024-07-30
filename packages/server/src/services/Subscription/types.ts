export const ERRORS = {
  SUBSCRIPTION_ID_NOT_ASSOCIATED_TO_TENANT:
    'SUBSCRIPTION_ID_NOT_ASSOCIATED_TO_TENANT',
};

export interface IOrganizationSubscriptionChanged {
  tenantId: number;
  lemonSubscriptionId: string;
  newVariantId: number;
}

export interface IOrganizationSubscriptionCanceled {
  tenantId: number;
  subscriptionId: string;
}

export interface IOrganizationSubscriptionResumed {
  tenantId: number;
  subscriptionId: number;
}
