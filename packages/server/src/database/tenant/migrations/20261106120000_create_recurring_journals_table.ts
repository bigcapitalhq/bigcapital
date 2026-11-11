/**
 * Creates the recurring journal profile tables and links generated manual
 * journals back to the recurring profile/occurrence.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('recurring_journals', (table) => {
    table.increments();

    table.string('profile_name', 255).notNullable();
    table.string('reference', 255).nullable();
    table.text('description').nullable();
    table.string('journal_type', 255).nullable().defaultTo('Journal');
    table.string('basis', 20).nullable();

    table.string('currency_code', 3).nullable();
    table.decimal('exchange_rate', 13, 9).defaultTo(1);

    table
      .integer('branch_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('branches');
    table.integer('user_id').unsigned().nullable();

    table.string('status', 20).notNullable().defaultTo('active');
    table.string('frequency', 20).notNullable();
    table.integer('repeat_interval').unsigned().notNullable().defaultTo(1);

    table.date('start_date').notNullable();
    table.date('end_date').nullable();
    table.integer('max_occurrences').unsigned().nullable();
    table.integer('occurrences_count').unsigned().notNullable().defaultTo(0);

    table.date('next_journal_date').nullable();
    table.date('last_journal_date').nullable();

    table.boolean('auto_publish').notNullable().defaultTo(false);

    table.integer('failure_count').unsigned().notNullable().defaultTo(0);
    table.text('last_error').nullable();

    table.timestamps();

    table.index(
      ['status', 'next_journal_date'],
      'recurring_journals_status_next_date_index',
    );
  });

  await knex.schema.createTable('recurring_journal_entries', (table) => {
    table.increments();

    table
      .integer('recurring_journal_id')
      .unsigned()
      .notNullable()
      .index('recurring_journal_entries_profile_index')
      .references('id')
      .inTable('recurring_journals')
      .onDelete('CASCADE');

    table.integer('index').unsigned().notNullable().defaultTo(1);
    table.decimal('credit', 13, 3).nullable();
    table.decimal('debit', 13, 3).nullable();

    table
      .integer('account_id')
      .unsigned()
      .notNullable()
      .index('recurring_journal_entries_account_index')
      .references('id')
      .inTable('accounts');

    table.text('note').nullable();

    table.integer('contact_id').unsigned().nullable().index();
    table
      .integer('branch_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('branches');
    table
      .integer('project_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('projects');
  });

  await knex.schema.createTable(
    'recurring_journal_entry_tracking_categories',
    (table) => {
      table.integer('recurring_journal_entry_id').unsigned().notNullable();
      table.integer('category_id').unsigned().notNullable();
      table.integer('option_id').unsigned().notNullable();
      table.timestamps();

      table.primary(
        ['recurring_journal_entry_id', 'category_id'],
        'rj_entry_tracking_primary',
      );
      table
        .foreign('recurring_journal_entry_id', 'fk_rjetc_entry')
        .references('recurring_journal_entries.id')
        .onDelete('CASCADE');
      table
        .foreign('category_id', 'fk_rjetc_category')
        .references('tracking_categories.id')
        .onDelete('CASCADE');
      table
        .foreign('option_id', 'fk_rjetc_option')
        .references('tracking_category_options.id')
        .onDelete('CASCADE');

      table.index(['category_id'], 'rj_entry_tracking_category_index');
      table.index(['option_id'], 'rj_entry_tracking_option_index');
    },
  );

  await knex.schema.alterTable('manual_journals', (table) => {
    table
      .integer('recurring_journal_id')
      .unsigned()
      .nullable()
      .index('manual_journals_recurring_journal_id_index')
      .references('id')
      .inTable('recurring_journals')
      .onDelete('SET NULL');

    table.date('recurring_journal_date').nullable();

    table.unique(
      ['recurring_journal_id', 'recurring_journal_date'],
      'manual_journals_recurring_occurrence_unique',
    );
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('manual_journals', (table) => {
    table.dropUnique(
      ['recurring_journal_id', 'recurring_journal_date'],
      'manual_journals_recurring_occurrence_unique',
    );
    table.dropColumn('recurring_journal_date');
    table.dropColumn('recurring_journal_id');
  });

  await knex.schema.dropTableIfExists(
    'recurring_journal_entry_tracking_categories',
  );
  await knex.schema.dropTableIfExists('recurring_journal_entries');
  await knex.schema.dropTableIfExists('recurring_journals');
};
