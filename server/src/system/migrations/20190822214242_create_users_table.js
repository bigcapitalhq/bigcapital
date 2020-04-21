
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('first_name');
    table.string('last_name');
    table.string('email').unique();
    table.string('phone_number').unique();
    table.string('password');
    table.boolean('active');
    table.integer('role_id').unique();
    table.string('language');
    table.date('last_login_at');
    table.integer('tenant_id').unsigned();
    table.timestamps();
  }).then(() => {
    // knex.seed.run({
    //   specific: 'seed_users.js',
    // })
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
