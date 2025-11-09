exports.up = (knex) => {
  return knex.schema
    .table('sales_invoices', (table) => {
      table.decimal('exchange_rate', 13, 9).after('currency_code');
    })
    .table('sales_estimates', (table) => {
      table.decimal('exchange_rate', 13, 9);
    })
    .table('sales_receipts', (table) => {
      table.decimal('exchange_rate', 13, 9).after('currency_code');
    })
    .table('payment_receives', (table) => {
      table.decimal('exchange_rate', 13, 9).after('currency_code');
    })
    .table('bills', (table) => {
      table.decimal('exchange_rate', 13, 9).after('currency_code');
    })
    .table('bills_payments', (table) => {
      table.decimal('exchange_rate', 13, 9).after('currency_code');
    })
    .table('credit_notes', (table) => {
      table.decimal('exchange_rate', 13, 9).after('currency_code');
    })
    .table('vendor_credits', (table) => {
      table.decimal('exchange_rate', 13, 9).after('currency_code');
    })
    .table('accounts_transactions', (table) => {
      table.string('currency_code', 3).after('debit');
      table.decimal('exchange_rate', 13, 9).after('currency_code');
    })
    .table('manual_journals', (table) => {
      table.decimal('exchange_rate', 13, 9).after('currency_code');
    })
    .table('cashflow_transactions', (table) => {
      table.string('currency_code', 3).after('amount');
      table.decimal('exchange_rate', 13, 9).after('currency_code');
    })
    .table('expenses_transactions', (table) => {
      table.decimal('exchange_rate', 13, 9).after('currency_code');
    })
    .table('refund_credit_note_transactions', (table) => {
      table.decimal('exchange_rate', 13, 9).after('currency_code');
    })
    .table('refund_vendor_credit_transactions', (table) => {
      table.decimal('exchange_rate', 13, 9).after('currency_code');
    })
    .table('bill_located_costs', (table) => {
      table.string('currency_code', 3).after('amount');
      table.decimal('exchange_rate', 13, 9).after('currency_code');
    })
    .table('contacts', (table) => {
      table
        .decimal('opening_balance_exchange_rate', 13, 9)
        .after('opening_balance_at');
    })
    .table('items', (table) => {
      table.dropColumn('currency_code');
    });
};

exports.down = (knex) => {
  return knex.schema
    .table('sales_invoices', (table) => {
      table.dropColumn('exchange_rate');
    })
    .table('sales_estimates', (table) => {
      table.dropColumn('exchange_rate');
    })
    .table('sales_receipts', (table) => {
      table.dropColumn('exchange_rate');
    })
    .table('payment_receives', (table) => {
      table.dropColumn('exchange_rate');
    })
    .table('bills', (table) => {
      table.dropColumn('exchange_rate');
    })
    .table('bills_payments', (table) => {
      table.dropColumn('exchange_rate');
    })
    .table('credit_notes', (table) => {
      table.dropColumn('exchange_rate');
    })
    .table('vendor_credits', (table) => {
      table.dropColumn('exchange_rate');
    })
    .table('accounts_transactions', (table) => {
      table.dropColumn('currency_code');
      table.dropColumn('exchange_rate');
    })
    .table('manual_journals', (table) => {
      table.dropColumn('exchange_rate');
    })
    .table('cashflow_transactions', (table) => {
      table.dropColumn('currency_code');
      table.dropColumn('exchange_rate');
    })
    .table('expenses_transactions', (table) => {
      table.dropColumn('exchange_rate');
    })
    .table('refund_credit_note_transactions', (table) => {
      table.dropColumn('exchange_rate');
    })
    .table('refund_vendor_credit_transactions', (table) => {
      table.dropColumn('exchange_rate');
    })
    .table('bill_located_costs', (table) => {
      table.dropColumn('currency_code');
      table.dropColumn('exchange_rate');
    })
    .table('contacts', (table) => {
      table.dropColumn('opening_balance_exchange_rate');
    });
};
