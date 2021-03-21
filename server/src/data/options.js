export default {
  organization: [
    {
      key: "name",
      type: "string",
      config: true,
    },
    {
      key: "base_currency",
      type: "string",
      config: true,
    },
    {
      key: "industry",
      type: "string",
    },
    {
      key: "location",
      type: "string",
    },
    {
      key: "fiscal_year",
      type: "string",
      // config: true,
    },
    {
      key: "financial_date_start",
      type: "string",
    },
    {
      key: "language",
      type: "string",
      config: true,
    },
    {
      key: "time_zone",
      type: "string",
    },
    {
      key: "date_format",
      type: "string",
    },
    {
      key: 'accounting_basis',
      type: 'string',
    }
  ],
  manual_journals: [
    {
      key: "next_number",
      type: "string",
    },
    {
      key: "number_prefix",
      type: "string",
    },
    {
      key: "auto_increment",
      type: "boolean",
    }
  ],
  bill_payments: [
    {
      key: 'withdrawal_account',
      type: 'string'
    }
  ],
  sales_estimates: [
    {
      key: "next_number",
      type: "number",
    },
    {
      key: "number_prefix",
      type: "string",
    },
    {
      key: "auto_increment",
      type: "boolean",
    }
  ],
  sales_receipts: [
    {
      key: "next_number",
      type: "number",
    },
    {
      key: "number_prefix",
      type: "string",
    },
    {
      key: "auto_increment",
      type: "boolean",
    },
    {
      key: "preferred_deposit_account",
      type: "number",
    },
  ],
  sales_invoices: [
    {
      key: "next_number",
      type: "number",
    },
    {
      key: "number_prefix",
      type: "string",
    },
    {
      key: "auto_increment",
      type: "boolean",
    }
  ],
  payment_receives: [
    {
      key: "next_number",
      type: "number",
    },
    {
      key: "number_prefix",
      type: "string",
    },
    {
      key: "auto_increment",
      type: "boolean",
    },
    {
      key: 'deposit_account',
      type: 'string'
    },
    {
      key: 'advance_deposit',
      key: 'string'
    }
  ],
  items: [
    {
      key: "sell_account",
      type: "number",
    },
    {
      key: "cost_account",
      type: "number",
    },
    {
      key: "inventory_account",
      type: "number",
    },
  ],
  expenses: [
    {
      key: "preferred_payment_account",
      type: "number",
    },
  ],
  accounts: [
    {
      key: 'account_code_required',
      type: 'boolean',
    },
    {
      key: 'account_code_unique',
      type: 'boolean',
    },
  ]
};
