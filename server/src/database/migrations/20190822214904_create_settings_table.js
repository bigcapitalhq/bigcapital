
exports.up = function (knex) {
  return knex.schema.createTable('settings', (table) => {
    table.increments();
    table.integer('user_id').unsigned().index();
    table.string('group').index();
    table.string('type');
    table.string('key').index();
    table.string('value');
  }).raw('ALTER TABLE `SETTINGS` AUTO_INCREMENT = 2000');
};

exports.down = (knex) => knex.schema.dropTableIfExists('settings');
