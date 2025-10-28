exports.up = (knex) => {
  return knex.schema.table('accounts', (table) => {
    table.date('seeded_at').after('currency_code').nullable();
  });
};

exports.down = (knex) => {};
