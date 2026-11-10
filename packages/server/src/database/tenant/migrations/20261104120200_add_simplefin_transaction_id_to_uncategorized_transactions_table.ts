exports.up = function (knex) {
  return knex.schema.table('uncategorized_cashflow_transactions', (table) => {
    table.string('simplefin_transaction_id').nullable();
    // SimpleFIN transaction ids are only unique within an account, so the
    // de-duplication index is scoped by account. MariaDB allows multiple NULLs.
    table.unique(['account_id', 'simplefin_transaction_id'], {
      indexName: 'uncategorized_trx_account_simplefin_trx_unique',
    });
  });
};

exports.down = function (knex) {
  return knex.schema.table('uncategorized_cashflow_transactions', (table) => {
    table.dropUnique(
      ['account_id', 'simplefin_transaction_id'],
      'uncategorized_trx_account_simplefin_trx_unique',
    );
    table.dropColumn('simplefin_transaction_id');
  });
};
