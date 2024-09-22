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
    isStripePaymentActive: boolean;
    stripeAccountId: string | null;
    stripePaymentMethodId: number | null;
    stripePublishableKey: string | null;
    stripeCurrencies: Array<string>;
    stripeRedirectUrl: string | null;
  };
}
