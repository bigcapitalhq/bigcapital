
exports.up = function (knex) {
  return knex.schema.createTable('accounts', (table) => {
    table.increments();
    table.string('name');
    table.integer('account_type_id');
    table.integer('parent_account_id');
    table.string('code', 10);
    table.text('description');
    table.timestamps();
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('accounts');
