export default {
  organization: {
    name: {
      type: 'string',
    },
    base_currency: {
      type: 'string',
    },
    industry: {
      type: 'string',
    },
    location: {
      type: 'string',
    },
    fiscal_year: {
      type: 'string',
    },
    financial_date_start: {
      type: 'string',
    },
    language: {
      type: 'string',
    },
    time_zone: {
      type: 'string',
    },
    date_format: {
      type: 'string',
    },
    accounting_basis: {
      type: 'string',
    },
  },
  manual_journals: {
    next_number: {
      type: 'string',
    },
    number_prefix: {
      type: 'string',
    },
    auto_increment: {
      type: 'boolean',
    },
  },
  bill_payments: {
    withdrawal_account: {
      type: 'number',
    },
  },
  sales_estimates: {
    next_number: {
      type: 'string',
    },
    number_prefix: {
      type: 'string',
    },
    auto_increment: {
      type: 'boolean',
    },
  },
  sales_receipts: {
    next_number: {
      type: 'string',
    },
    number_prefix: {
      type: 'string',
    },
    auto_increment: {
      type: 'boolean',
    },
    preferred_deposit_account: {
      type: 'number',
    },
  },
  sales_invoices: {
    next_number: {
      type: 'string',
    },
    number_prefix: {
      type: 'string',
    },
    auto_increment: {
      type: 'boolean',
    },
  },
  payment_receives: {
    next_number: {
      type: 'string',
    },
    number_prefix: {
      type: 'string',
    },
    auto_increment: {
      type: 'boolean',
    },
    deposit_account: {
      type: 'number',
    },
    advance_deposit: {
      type: 'number',
    },
  },
  items: {
    sell_account: {
      type: 'number',
    },
    cost_account: {
      type: 'number',
    },
    inventory_account: {
      type: 'number',
    },
  },
  expenses: {
    preferred_payment_account: {
      type: 'number',
    },
  },
  accounts: {
    account_code_required: {
      type: 'boolean',
    },
    account_code_unique: {
      type: 'boolean',
    },
  },
};
