exports.up = function (knex) {
  return knex.schema.createTable('user_tenants', (table) => {
    table.bigIncrements('id');
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .bigInteger('tenant_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('tenants')
      .onDelete('CASCADE');
    table.string('role', 20).notNullable().defaultTo('owner');
    table.timestamps();
    table.unique(['user_id', 'tenant_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user_tenants');
};
