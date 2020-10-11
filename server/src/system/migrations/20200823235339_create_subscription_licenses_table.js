
exports.up = function(knex) {
  return knex.schema.createTable('subscription_licenses', table => {
    table.increments();

    table.string('license_code').unique().index();
    table.integer('plan_id').unsigned().index().references('id').inTable('subscription_plans');

    table.integer('license_period').unsigned();
    table.string('period_interval');

    table.dateTime('sent_at').index();
    table.dateTime('disabled_at').index();
    table.dateTime('used_at').index();

    table.timestamps();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('subscription_licenses');
};
