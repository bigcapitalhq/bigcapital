
exports.up = function (knex) {
  return knex.schema.createTable('accounts', (table) => {
    table.bigIncrements('id').comment('Auto-generated id');;
    table.string('name');
    table.integer('account_type_id').unsigned();
    table.integer('parent_account_id').unsigned();
    table.string('code', 10);
    table.text('description');
    table.boolean('active').defaultTo(true);
    table.integer('index').unsigned();
    table.boolean('predefined').defaultTo(false);
    table.timestamps();
  }).raw('ALTER TABLE `ACCOUNTS` AUTO_INCREMENT = 1000').then(() => {
    return knex.seed.run({
      specific: 'seed_accounts.js',
    });
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('accounts');
