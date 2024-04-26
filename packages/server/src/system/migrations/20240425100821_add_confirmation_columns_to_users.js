exports.up = function (knex) {
  return knex.schema.table('users', (table) => {
    table.string('verify_token');
    table.boolean('verified').defaultTo(false);
  });
};

exports.down = (knex) => {};
