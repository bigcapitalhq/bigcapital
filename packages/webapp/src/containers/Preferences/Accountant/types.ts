export interface AccountantFormValues {
  organization: {
    accountingBasis: string;
  };
  accounts: {
    accountCodeRequired: boolean;
    accountCodeUnique: boolean;
  };
  billPayments: {
    withdrawalAccount: string;
  };
  paymentReceives: {
    preferredDepositAccount: string;
    preferredAdvanceDeposit: string;
  };
}
