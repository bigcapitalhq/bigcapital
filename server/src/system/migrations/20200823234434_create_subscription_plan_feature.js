
exports.up = function(knex) {
  return knex.schema.createTable('subscription_plan_features', table => {
    table.increments();
    table.integer('plan_id').unsigned().index().references('id').inTable('subscription_plans');
    table.string('slug');
    table.string('name');
    table.string('description');
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('subscription_plan_features');
};
