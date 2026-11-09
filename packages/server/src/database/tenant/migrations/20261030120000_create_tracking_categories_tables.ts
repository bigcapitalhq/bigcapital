/**
 * Creates the tracking categories schema.
 *
 * Tracking categories are organization-level dimensions (e.g. Location,
 * Department) with a set of options. Manual journal entries can reference one
 * option per category, and the assignments are propagated to the general
 * ledger so reports can filter on them in the future.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('tracking_categories', (table) => {
    table.increments();
    table.string('name', 255).notNullable();
    table.string('description', 500).nullable();
    table.boolean('active').notNullable().defaultTo(true);
    table.timestamps();

    table.unique(['name'], 'tracking_categories_name_unique');
    table.index(['active'], 'tracking_categories_active_index');
  });

  await knex.schema.createTable('tracking_category_options', (table) => {
    table.increments();
    table.integer('category_id').unsigned().notNullable();
    table.string('name', 255).notNullable();
    table.boolean('active').notNullable().defaultTo(true);
    table.timestamps();

    table.unique(
      ['category_id', 'name'],
      'tracking_category_options_name_unique',
    );
    table.index(['category_id'], 'tracking_category_options_category_index');
    table.index(['active'], 'tracking_category_options_active_index');
    table
      .foreign('category_id', 'fk_tc_options_category')
      .references('tracking_categories.id')
      .onDelete('CASCADE');
  });

  await knex.schema.createTable(
    'manual_journal_entry_tracking_categories',
    (table) => {
      table.integer('manual_journal_entry_id').unsigned().notNullable();
      table.integer('category_id').unsigned().notNullable();
      table.integer('option_id').unsigned().notNullable();
      table.timestamps();

      table.primary(
        ['manual_journal_entry_id', 'category_id'],
        'mj_entry_tracking_primary',
      );
      table
        .foreign('manual_journal_entry_id', 'fk_mjetc_entry')
        .references('manual_journals_entries.id')
        .onDelete('CASCADE');
      table
        .foreign('category_id', 'fk_mjetc_category')
        .references('tracking_categories.id')
        .onDelete('CASCADE');
      table
        .foreign('option_id', 'fk_mjetc_option')
        .references('tracking_category_options.id')
        .onDelete('CASCADE');

      table.index(['category_id'], 'mj_entry_tracking_category_index');
      table.index(['option_id'], 'mj_entry_tracking_option_index');
    },
  );

  await knex.schema.createTable(
    'account_transaction_tracking_categories',
    (table) => {
      table.integer('account_transaction_id').unsigned().notNullable();
      table.integer('category_id').unsigned().notNullable();
      table.integer('option_id').unsigned().notNullable();
      table.timestamps();

      table.primary(
        ['account_transaction_id', 'category_id'],
        'acct_txn_tracking_primary',
      );
      table
        .foreign('account_transaction_id', 'fk_attc_transaction')
        .references('accounts_transactions.id')
        .onDelete('CASCADE');
      table
        .foreign('category_id', 'fk_attc_category')
        .references('tracking_categories.id')
        .onDelete('CASCADE');
      table
        .foreign('option_id', 'fk_attc_option')
        .references('tracking_category_options.id')
        .onDelete('CASCADE');

      table.index(['category_id'], 'acct_txn_tracking_category_index');
      table.index(['option_id'], 'acct_txn_tracking_option_index');
    },
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists(
    'account_transaction_tracking_categories',
  );
  await knex.schema.dropTableIfExists(
    'manual_journal_entry_tracking_categories',
  );
  await knex.schema.dropTableIfExists('tracking_category_options');
  await knex.schema.dropTableIfExists('tracking_categories');
};
