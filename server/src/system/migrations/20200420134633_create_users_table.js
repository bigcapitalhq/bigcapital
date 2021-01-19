
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('first_name');
    table.string('last_name');
    table.string('email').index();
    table.string('phone_number').index();
    table.string('password');
    table.boolean('active').index();
    table.string('language');
    table.bigInteger('tenant_id').unsigned().index().references('id').inTable('tenants');
    table.date('invite_accepted_at').index();
    table.date('last_login_at').index();
    table.dateTime('deleted_at').index();
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
