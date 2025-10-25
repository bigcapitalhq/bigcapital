/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('payment_links', (table) => {
    table.increments('id');
    table.integer('tenant_id');
    table.integer('resource_id');
    table.text('resource_type');
    table.string('linkId');
    table.string('publicity');
    table.datetime('expiry_at');
    table.timestamps();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('payment_links');
};
