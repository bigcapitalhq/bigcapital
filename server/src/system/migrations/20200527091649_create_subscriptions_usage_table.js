exports.up = function(knex) {
  return knex.schema.createTable('subscriptions_usage', table => {
    table.increments();
    table.integer('user_id');
    table.integer('plan_id');

    table.dateTime('trial_ends_at');

    table.dateTime('subscription_starts_at');
    table.dateTime('subscription_ends_at');

    table.timestamps();
  });  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('subscriptions_usage');
};
