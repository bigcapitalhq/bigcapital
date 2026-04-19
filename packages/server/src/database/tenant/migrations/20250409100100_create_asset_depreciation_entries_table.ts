exports.up = function(knex) {
  return knex.schema.createTable('asset_depreciation_entries', (table) => {
    table.increments('id').primary();
    table.integer('asset_id').unsigned().references('id').inTable('assets').notNullable().onDelete('CASCADE');

    // Depreciation period
    table.date('depreciation_date').notNullable();
    table.integer('period_year').unsigned().notNullable();
    table.integer('period_month').unsigned().notNullable();

    // Calculated amounts
    table.decimal('depreciation_amount', 15, 2).notNullable();
    table.decimal('accumulated_depreciation', 15, 2).notNullable();
    table.decimal('book_value', 15, 2).notNullable();

    // Journal entry reference
    table.integer('journal_id').unsigned().references('id').inTable('manual_journals').nullable();
    table.boolean('is_posted').defaultTo(false);
    table.datetime('posted_at').nullable();

    table.timestamps(true, true);

    // Indexes
    table.index('asset_id');
    table.index(['period_year', 'period_month']);
    table.index('depreciation_date');
    table.unique(['asset_id', 'period_year', 'period_month']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('asset_depreciation_entries');
};
