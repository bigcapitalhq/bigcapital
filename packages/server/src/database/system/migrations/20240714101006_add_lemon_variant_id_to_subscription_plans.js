exports.up = function (knex) {
  return knex.schema.table('subscription_plans', (table) => {
    table.string('lemon_variant_id').nullable().index();
  });
};

exports.down = (knex) => {
  return knex.schema.table('subscription_plans', (table) => {
    table.dropColumn('lemon_variant_id');
  });
};
