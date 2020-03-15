
exports.up = (knex) => {
  return knex.schema.createTable('account_types', (table) => {
    table.increments();
    table.string('name');
    table.string('normal');
    table.boolean('balance_sheet');
    table.boolean('income_sheet');
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('account_types');
