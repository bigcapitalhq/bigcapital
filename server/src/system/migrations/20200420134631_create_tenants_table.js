
exports.up = function(knex) {
  return knex.schema.createTable('tenants', (table) => {
    table.bigIncrements();
    table.string('organization_id');
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tenants');
};
