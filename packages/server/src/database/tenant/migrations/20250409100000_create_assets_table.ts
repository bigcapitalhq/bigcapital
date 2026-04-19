exports.up = function(knex) {
  return knex.schema.createTable('assets', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('code').nullable().unique();
    table.text('description').nullable();

    // Asset classification
    table.integer('asset_account_id').unsigned().references('id').inTable('accounts').notNullable();
    table.integer('category_id').unsigned().references('id').inTable('items_categories').nullable();

    // Purchase details
    table.decimal('purchase_price', 15, 2).notNullable().defaultTo(0);
    table.date('purchase_date').notNullable();
    table.string('purchase_reference').nullable();
    table.integer('purchase_transaction_id').unsigned().nullable();
    table.string('purchase_transaction_type').nullable();

    // Depreciation settings
    table.enum('depreciation_method', [
      'straight_line',
      'declining_balance',
      'sum_of_years_digits',
      'units_of_production'
    ]).notNullable().defaultTo('straight_line');
    table.decimal('depreciation_rate', 5, 2).nullable();
    table.integer('useful_life_years').unsigned().nullable();
    table.decimal('residual_value', 15, 2).notNullable().defaultTo(0);
    table.date('depreciation_start_date').notNullable();
    table.enum('depreciation_frequency', ['daily', 'monthly', 'yearly']).defaultTo('monthly');

    // Accounts for depreciation
    table.integer('depreciation_expense_account_id').unsigned().references('id').inTable('accounts').notNullable();
    table.integer('accumulated_depreciation_account_id').unsigned().references('id').inTable('accounts').notNullable();

    // Current values (calculated)
    table.decimal('opening_depreciation', 15, 2).notNullable().defaultTo(0);
    table.decimal('current_depreciation', 15, 2).notNullable().defaultTo(0);
    table.decimal('total_depreciation', 15, 2).notNullable().defaultTo(0);
    table.decimal('book_value', 15, 2).notNullable();

    // Disposal
    table.enum('status', ['active', 'fully_depreciated', 'disposed', 'sold']).defaultTo('active');
    table.date('disposal_date').nullable();
    table.decimal('disposal_proceeds', 15, 2).nullable();
    table.decimal('disposal_gain_loss', 15, 2).nullable();
    table.text('disposal_notes').nullable();

    // Metadata
    table.string('serial_number').nullable();
    table.string('location').nullable();
    table.integer('user_id').unsigned().references('id').inTable('users').notNullable();
    table.boolean('active').defaultTo(true);
    table.timestamps(true, true);

    // Indexes
    table.index('asset_account_id');
    table.index('status');
    table.index('purchase_date');
    table.index('depreciation_start_date');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('assets');
};
