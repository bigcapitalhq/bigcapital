
exports.up = function(knex) {
  return knex.schema.createTable('subscription_licenses', table => {
    table.increments();
    table.string('key');
    table.integer('license_period');
    table.string('license_interval');
    table.boolean('used').defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('subscription_licenses');
};
