
exports.up = (knex) => {
  return knex.schema.createTable('account_types', (table) => {
    table.increments();
    table.string('name');
    table.string('key').index();
    table.string('normal').index();
    table.string('root_type').index();
    table.string('child_type');
    table.boolean('balance_sheet');
    table.boolean('income_sheet');
  }).raw('ALTER TABLE `ACCOUNT_TYPES` AUTO_INCREMENT = 1000');
};

exports.down = (knex) => knex.schema.dropTableIfExists('account_types');
