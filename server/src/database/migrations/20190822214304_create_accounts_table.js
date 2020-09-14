
exports.up = function (knex) {
  return knex.schema.createTable('accounts', (table) => {
    table.bigIncrements('id').comment('Auto-generated id');;
    table.string('name');
    table.string('slug');
    table.integer('account_type_id').unsigned();
    table.integer('parent_account_id').unsigned();
    table.string('code', 10);
    table.text('description');
    table.boolean('active').defaultTo(true);
    table.integer('index').unsigned();
    table.boolean('predefined').defaultTo(false);
    table.decimal('amount', 15, 5);
    table.string('currency_code', 3);
    table.timestamps();
  }).raw('ALTER TABLE `ACCOUNTS` AUTO_INCREMENT = 1000');
};

exports.down = (knex) => knex.schema.dropTableIfExists('accounts');
