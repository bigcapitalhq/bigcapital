/**
 * Creates the item images table.
 *
 * Each item can have one front image, one rear image, and any number of other
 * images (up to the application-level limit). The original image and its
 * resized thumbnail are stored in S3; the item's primary thumbnail key is
 * denormalized into `items.picture_uri` for fast list rendering.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('items_images', (table) => {
    table.increments();
    table
      .integer('item_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('items')
      .onDelete('CASCADE');
    table.string('key', 255).notNullable();
    table.string('thumbnail_key', 255).notNullable();
    table.string('type', 10).notNullable().defaultTo('other');
    table.string('origin_name', 255).nullable();
    table.string('mime_type', 100).nullable();
    table.integer('size').unsigned().nullable();
    table.timestamps();

    table.index(['item_id', 'type'], 'items_images_item_id_type_index');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('items_images');
};
