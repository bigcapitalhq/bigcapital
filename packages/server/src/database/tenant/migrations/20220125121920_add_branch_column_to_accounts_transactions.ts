exports.up = (knex) => {
  return knex.schema
    .table('accounts_transactions', (table) => {
      table
        .integer('branch_id')
        .unsigned()
        .references('id')
        .inTable('branches');
    })
    .table('manual_journals', (table) => {
      table
        .integer('branch_id')
        .unsigned()
        .references('id')
        .inTable('branches');
    })
    .table('manual_journals_entries', (table) => {
      table
        .integer('branch_id')
        .unsigned()
        .references('id')
        .inTable('branches');
    })
    .table('expenses_transactions', (table) => {
      table
        .integer('branch_id')
        .unsigned()
        .references('id')
        .inTable('branches')
        .after('user_id');
    })
    .table('cashflow_transactions', (table) => {
      table
        .integer('branch_id')
        .unsigned()
        .references('id')
        .inTable('branches')
        .after('user_id');
    })
    .table('contacts', (table) => {
      table
        .integer('opening_balance_branch_id')
        .unsigned()
        .references('id')
        .inTable('branches')
        .after('opening_balance_at');
    })
    .table('refund_credit_note_transactions', (table) => {
      table
        .integer('branch_id')
        .unsigned()
        .references('id')
        .inTable('branches')
        .after('description');
    })
    .table('refund_vendor_credit_transactions', (table) => {
      table
        .integer('branch_id')
        .unsigned()
        .references('id')
        .inTable('branches')
        .after('description');
    });
};

exports.down = (knex) => {
  return knex.schema
    .table('accounts_transactions', (table) => {
      table.dropColumn('branch_id');
    })
    .table('manual_journals', (table) => {
      table.dropColumn('branch_id');
    })
    .table('manual_journals_entries', (table) => {
      table.dropColumn('branch_id');
    })
    .table('cashflow_transactions', (table) => {
      table.dropColumn('branch_id');
    })
    .table('refund_credit_note_transactions', (table) => {
      table.dropColumn('branch_id');
    })
    .table('refund_vendor_credit_transactions', (table) => {
      table.dropColumn('branch_id');
    });
};
