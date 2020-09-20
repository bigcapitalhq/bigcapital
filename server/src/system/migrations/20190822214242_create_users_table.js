
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('first_name');
    table.string('last_name');
    table.string('email').unique();
    table.string('phone_number').unique();
    table.string('password');
    table.boolean('active');
    table.string('language');

    table.integer('tenant_id').unsigned();

    table.date('invite_accepted_at');
    table.date('last_login_at');

    table.dateTime('deleted_at');
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
