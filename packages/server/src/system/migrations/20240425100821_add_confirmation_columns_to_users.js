exports.up = function (knex) {
  return knex.schema
    .table('users', (table) => {
      table.string('verify_token');
      table.boolean('verified').defaultTo(false);
    })
    .then(() => {
      return knex('USERS').update({ verified: true });
    });
};

exports.down = (knex) => {};
