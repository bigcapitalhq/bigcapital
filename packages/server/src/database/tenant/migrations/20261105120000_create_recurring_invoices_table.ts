/**
 * Creates the recurring invoices table and links generated sale invoices
 * back to the recurring profile/occurrence.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('recurring_invoices', (table) => {
    table.increments();

    table
      .integer('customer_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('contacts');

    table.string('profile_name', 255).notNullable();
    table.string('reference_no', 255).nullable();

    table.text('invoice_message').nullable();
    table.text('terms_conditions').nullable();

    table.string('currency_code', 3).nullable();
    table.decimal('exchange_rate', 13, 9).defaultTo(1);

    table.decimal('discount', 10, 2).nullable();
    table.string('discount_type', 255).nullable();
    table.decimal('adjustment', 10, 2).nullable();
    table.boolean('is_inclusive_tax').defaultTo(false);

    table
      .integer('branch_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('branches');
    table
      .integer('warehouse_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('warehouses');
    table
      .integer('pdf_template_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('pdf_templates');

    table.integer('user_id').unsigned().nullable();

    table.string('status', 20).notNullable().defaultTo('active');
    table.string('frequency', 20).notNullable();
    table.integer('repeat_interval').unsigned().notNullable().defaultTo(1);

    table.date('start_date').notNullable();
    table.date('end_date').nullable();
    table.integer('max_occurrences').unsigned().nullable();
    table.integer('occurrences_count').unsigned().notNullable().defaultTo(0);

    table.date('next_invoice_date').nullable();
    table.date('last_invoice_date').nullable();
    table.integer('due_days').unsigned().notNullable().defaultTo(0);

    table.string('delivery_mode', 20).notNullable().defaultTo('draft');
    table.string('email_subject', 255).nullable();
    table.text('email_message').nullable();
    table.json('email_cc').nullable();
    table.json('email_bcc').nullable();
    table.boolean('attach_invoice').notNullable().defaultTo(true);

    table.integer('failure_count').unsigned().notNullable().defaultTo(0);
    table.text('last_error').nullable();

    table.timestamps();

    table.index(
      ['status', 'next_invoice_date'],
      'recurring_invoices_status_next_date_index',
    );
  });

  await knex.schema.alterTable('sales_invoices', (table) => {
    table
      .integer('recurring_invoice_id')
      .unsigned()
      .nullable()
      .index('sales_invoices_recurring_invoice_id_index')
      .references('id')
      .inTable('recurring_invoices')
      .onDelete('SET NULL');

    table.date('recurring_invoice_date').nullable();

    table.unique(
      ['recurring_invoice_id', 'recurring_invoice_date'],
      'sales_invoices_recurring_occurrence_unique',
    );
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('sales_invoices', (table) => {
    table.dropUnique(
      ['recurring_invoice_id', 'recurring_invoice_date'],
      'sales_invoices_recurring_occurrence_unique',
    );
    table.dropColumn('recurring_invoice_date');
    table.dropColumn('recurring_invoice_id');
  });

  await knex.schema.dropTableIfExists('recurring_invoices');
};
