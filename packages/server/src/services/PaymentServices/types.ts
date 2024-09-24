export interface EditPaymentMethodDTO {
  name?: string;
  options?: {
    bankAccountId?: number; // bank account.
    clearningAccountId?: number; // current liability.

    showVisa?: boolean;
    showMasterCard?: boolean;
    showDiscover?: boolean;
    showAmer?: boolean;
    showJcb?: boolean;
    showDiners?: boolean;
  };
}

export interface GetPaymentMethodsPOJO {
  stripe: {
    isStripeAccountCreated: boolean;

    isStripePaymentEnabled: boolean;
    isStripePayoutEnabled: boolean;
    isStripeEnabled: boolean;

    isStripeServerConfigured: boolean;
    
    stripeAccountId: string | null;
    stripePaymentMethodId: number | null;
    stripePublishableKey: string | null;
    stripeAuthLink: string;
    stripeCurrencies: Array<string>;
    stripeRedirectUrl: string | null;
  };
}
