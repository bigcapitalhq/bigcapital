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
      // config: true,
    },
    {
      key: "date_format",
      type: "string",
      // config: true,
    },
  ],
  manual_journals: [
    {
      key: "next_number",
      type: "number",
    },
    {
      key: "number_prefix",
      type: "string",
    },
  ],
  bills: [
    {
      key: "next_number",
      type: "number",
    },
    {
      key: "number_prefix",
      type: "string",
    },
  ],
  bill_payments: [
    {
      key: "next_number",
      type: "number",
    },
    {
      key: "number_prefix",
      type: "string",
    },
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
  ],
  items: [
    {
      key: "preferred_sell_account",
      type: "number",
    },
    {
      key: "preferred_cost_account",
      type: "number",
    },
    {
      key: "preferred_inventory_account",
      type: "number",
    },
  ],
};
