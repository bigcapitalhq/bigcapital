/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('sales_estimates', (table) => {
    table.decimal('discount', 10, 2).nullable().after('amount');
    table.string('discount_type').nullable().after('discount');

    table.decimal('adjustment', 10, 2).nullable().after('discount_type'); 
  }); 
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('sales_estimates', (table) => {
    table.dropColumn('discount');
    table.dropColumn('discount_type');
    table.dropColumn('adjustment');
  });
};
