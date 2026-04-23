exports.up = function (knex) {
  return knex.schema
    .createTable('square_item_mappings', (table) => {
      table.increments('id');
      table
        .integer('connection_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('square_connections')
        .onDelete('CASCADE');
      // Square Catalog object id (ITEM or ITEM_VARIATION).
      table.string('square_catalog_object_id', 128).notNullable();
      table.string('square_object_type', 32).notNullable();
      table.string('square_name', 255).nullable();
      table.string('square_sku', 128).nullable();
      // Null = ignore (do not import as line item; fall back to default).
      table
        .integer('item_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('items');
      table.boolean('auto_created').notNullable().defaultTo(false);
      table.timestamps();

      table.unique(['connection_id', 'square_catalog_object_id']);
    })
    .raw('ALTER TABLE `SQUARE_ITEM_MAPPINGS` AUTO_INCREMENT = 1000');
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('square_item_mappings');
};
