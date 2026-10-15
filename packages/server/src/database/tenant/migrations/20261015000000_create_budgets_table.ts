exports.up = function (knex) {
  return knex.schema
    .createTable('budgets', (table) => {
      table.increments('id').primary();
      table.string('name').index();
      table.text('description').nullable();
      table.date('from_date').index();
      table.date('to_date').index();
      table.timestamps();
    })
    .createTable('budget_entries', (table) => {
      table.increments('id').primary();
      table
        .integer('budget_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('budgets')
        .onDelete('CASCADE');
      table
        .integer('account_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('accounts');
      table.date('date').index();
      table.decimal('amount', 13, 3);
      table.timestamps();
      table.unique(['budget_id', 'account_id', 'date']);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('budget_entries')
    .dropTableIfExists('budgets');
};
