
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('first_name');
    table.string('last_name');
    table.string('email').unique();
    table.string('phone_number').unique();
    table.boolean('active');
    table.integer('role_id').unique();
    table.string('language');
    table.date('last_login_at');

    table.date('invite_accepted_at');
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
