exports.up = (knex) => {
  return knex.schema.table('accounts_transactions', (table) => {
    table.boolean('costable');
  });
};

exports.down = (knex) => {
  return knex.schema.table('accounts_transactions', (table) => {
    table.dropColumn('costable');
  });
};
