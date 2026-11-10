exports.up = function (knex) {
  return knex.schema.createTable('simplefin_items', (table) => {
    table.bigIncrements('id');
    table
      .bigInteger('tenant_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('tenants');
    table.string('simplefin_item_id').index();
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('simplefin_items');
};
