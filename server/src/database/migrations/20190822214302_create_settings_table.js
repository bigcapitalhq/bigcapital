
exports.up = function (knex) {
  return knex.schema.createTable('settings', (table) => {
    table.increments();
    table.integer('user_id').unsigned().references('id').inTable('users');
    table.string('group');
    table.string('type');
    table.string('key');
    table.string('value');
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('settings');
