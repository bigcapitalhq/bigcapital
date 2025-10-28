exports.up = function (knex) {
  return knex.schema.table('accounts', (table) => {
    table.string('plaid_account_id');
    table.string('account_mask').nullable();
    table.decimal('bank_balance', 15, 5);
  });
};

exports.down = function (knex) {};
