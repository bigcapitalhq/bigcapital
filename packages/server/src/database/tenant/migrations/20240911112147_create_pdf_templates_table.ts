/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('pdf_templates', (table) => {
      table.increments('id').primary();
      table.text('resource');
      table.text('template_name');
      table.json('attributes');
      table.boolean('predefined').defaultTo(false);
      table.boolean('default').defaultTo(false);
      table.timestamps();
    })
    .table('sales_invoices', (table) => {
      table
        .integer('pdf_template_id')
        .unsigned()
        .references('id')
        .inTable('pdf_templates');
    })
    .table('sales_estimates', (table) => {
      table
        .integer('pdf_template_id')
        .unsigned()
        .references('id')
        .inTable('pdf_templates');
    })
    .table('sales_receipts', (table) => {
      table
        .integer('pdf_template_id')
        .unsigned()
        .references('id')
        .inTable('pdf_templates');
    })
    .table('credit_notes', (table) => {
      table
        .integer('pdf_template_id')
        .unsigned()
        .references('id')
        .inTable('pdf_templates');
    })
    .table('payment_receives', (table) => {
      table
        .integer('pdf_template_id')
        .unsigned()
        .references('id')
        .inTable('pdf_templates');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .table('payment_receives', (table) => {
      table.dropColumn('pdf_template_id');
    })
    .table('credit_notes', (table) => {
      table.dropColumn('pdf_template_id');
    })
    .table('sales_receipts', (table) => {
      table.dropColumn('pdf_template_id');
    })
    .table('sales_estimates', (table) => {
      table.dropColumn('pdf_template_id');
    })
    .table('sales_invoices', (table) => {
      table.dropColumn('pdf_template_id');
    })
    .dropTableIfExists('pdf_templates');
};
