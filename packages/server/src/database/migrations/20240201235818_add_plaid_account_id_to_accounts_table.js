exports.up = function (knex) {
  return knex.schema.table('accounts', (table) => {
    table.string('plaid_account_id');
  });
};

exports.down = function (knex) {};
