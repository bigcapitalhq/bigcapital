
exports.up = function(knex) {
  return knex.schema.createTable('tenants', (table) => {
    table.bigIncrements();
    table.string('organization_id').index();

    table.dateTime('under_maintenance_since').nullable();
    table.dateTime('initialized_at').nullable();
    table.dateTime('seeded_at').nullable();
    table.dateTime('built_at').nullable();
    table.string('build_job_id');

    table.integer('database_batch');
    table.string('upgrade_job_id');

    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tenants');
};
