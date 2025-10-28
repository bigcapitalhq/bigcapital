exports.up = function (knex) {
  return knex.schema.createTable('plaid_items', (table) => {
    table.bigIncrements('id');
    table
      .bigInteger('tenant_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('tenants');
    table.string('plaid_item_id');
    table.timestamps();
  });
};

exports.down = (knex) => {};
