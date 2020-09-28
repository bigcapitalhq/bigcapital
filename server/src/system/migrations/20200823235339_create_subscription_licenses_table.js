
exports.up = function(knex) {
  return knex.schema.createTable('subscription_licenses', table => {
    table.increments();

    table.string('license_code').unique();
    table.integer('plan_id').unsigned();

    table.integer('license_period').unsigned();
    table.string('period_interval');

    table.dateTime('sent_at');
    table.dateTime('disabled_at');
    table.dateTime('used_at');

    table.timestamps();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('subscription_licenses');
};
