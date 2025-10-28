exports.up = (knex) => {
  return knex.schema.createTable('branches', (table) => {
    table.increments();

    table.string('name');
    table.string('code');

    table.string('address');
    table.string('city');
    table.string('country');

    table.string('phone_number');
    table.string('email');
    table.string('website');

    table.boolean('primary');

    table.timestamps();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('branches');
};
