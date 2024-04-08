exports.up = (knex) =>
  knex.schema.table('users', (table) => {
    table.dropColumn('phone_number');
  });

exports.down = (knex) => knex.schema.table('users', (table) => {});
