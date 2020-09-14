
exports.up = function(knex) {
  return knex.schema.createTable('tenants', (table) => {
    table.bigIncrements();
    table.string('organization_id');

    table.dateTime('under_maintenance_since').nullable();
    table.dateTime('initialized_at').nullable();
    table.dateTime('seeded_at').nullable();
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tenants');
};
