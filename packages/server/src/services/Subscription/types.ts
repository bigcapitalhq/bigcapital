export const ERRORS = {
  SUBSCRIPTION_ID_NOT_ASSOCIATED_TO_TENANT:
    'SUBSCRIPTION_ID_NOT_ASSOCIATED_TO_TENANT',
  SUBSCRIPTION_NOT_EXIST: 'SUBSCRIPTION_NOT_EXIST',
  SUBSCRIPTION_ALREADY_CANCELED: 'SUBSCRIPTION_ALREADY_CANCELED',
  SUBSCRIPTION_ALREADY_ACTIVE: 'SUBSCRIPTION_ALREADY_ACTIVE',
  SOMETHING_WENT_WRONG_WITH_LS: 'SOMETHING_WENT_WRONG_WITH_LS',
};

export interface IOrganizationSubscriptionChanged {
  tenantId: number;
  lemonSubscriptionId: string;
  newVariantId: number;
}

export interface IOrganizationSubscriptionCancel {
  tenantId: number;
  subscriptionId: string;
}

export interface IOrganizationSubscriptionCancelled {
  tenantId: number;
  subscriptionId: string;
}

export interface IOrganizationSubscriptionResume {
  tenantId: number;
  subscriptionId: number;
}
export interface IOrganizationSubscriptionResumed {
  tenantId: number;
  subscriptionId: number;
}
