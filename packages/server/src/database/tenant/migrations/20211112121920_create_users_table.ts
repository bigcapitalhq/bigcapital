exports.up = (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('first_name');
    table.string('last_name');
    table.string('email').index();
    table.string('phone_number').index();
    table.boolean('active').index();
    table.integer('role_id').unsigned().references('id').inTable('roles');
    table.integer('system_user_id').unsigned();
    table.dateTime('invited_at').index();
    table.dateTime('invite_accepted_at').index();
    table.timestamps();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('users');
};
