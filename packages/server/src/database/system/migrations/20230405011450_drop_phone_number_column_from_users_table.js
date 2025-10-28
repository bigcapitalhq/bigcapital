exports.up = function (knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('phone_number');
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', (table) => {});
};
