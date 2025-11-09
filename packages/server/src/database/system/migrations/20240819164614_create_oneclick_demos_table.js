/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('oneclick_demos', (table) => {
    table.increments('id');
    table.string('key');
    table.integer('tenant_id').unsigned();
    table.integer('user_id').unsigned();
    table.timestamps();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('oneclick_demos');
};
