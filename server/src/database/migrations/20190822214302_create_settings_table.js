
exports.up = function (knex) {
  return knex.schema.createTable('settings', (table) => {
    table.increments();
    table.integer('user_id').unsigned();
    table.string('group');
    table.string('type');
    table.string('key');
    table.string('value');
  }).raw('ALTER TABLE `SETTINGS` AUTO_INCREMENT = 2000');
};

exports.down = (knex) => knex.schema.dropTableIfExists('settings');
