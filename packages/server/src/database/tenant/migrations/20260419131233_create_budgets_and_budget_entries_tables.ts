/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('budgets', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description').nullable();
      table.date('start_date').notNullable();
      table.date('end_date').notNullable();
      table
        .enu('budget_type', ['profit_and_loss', 'balance_sheet'])
        .notNullable()
        .defaultTo('profit_and_loss');
      table
        .enu('period_type', ['monthly', 'quarterly', 'annual'])
        .notNullable()
        .defaultTo('monthly');
      table
        .enu('status', ['draft', 'active', 'closed'])
        .notNullable()
        .defaultTo('draft');
      table.timestamps();
    })
    .createTable('budget_entries', (table) => {
      table.increments('id').primary();
      table
        .integer('budget_id')
        .unsigned()
        .references('id')
        .inTable('budgets')
        .onDelete('CASCADE');
      table
        .integer('account_id')
        .unsigned()
        .references('id')
        .inTable('accounts')
        .onDelete('CASCADE');
      table.decimal('amount', 19, 4).notNullable().defaultTo(0);
      table.date('period_date').notNullable();
      table.timestamps();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('budget_entries')
    .dropTableIfExists('budgets');
};
