import React from 'react';

const DeleteBankRuleAlert = React.lazy(() =>
  import('./alerts/DeleteBankRuleAlert').then((m) => ({
    default: m.DeleteBankRuleAlert,
  })),
);

/**
 * Cashflow alerts.
 */
export const BankRulesAlerts = [
  {
    name: 'bank-rule-delete',
    component: DeleteBankRuleAlert,
  },
];
