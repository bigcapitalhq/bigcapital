exports.up = function (knex) {
  return knex.schema
    .createTable('items_entries_taxes', (table) => {
      table.increments();
      table
        .integer('item_entry_id')
        .unsigned()
        .references('id')
        .inTable('items_entries')
        .onDelete('CASCADE');
      table
        .integer('tax_rate_id')
        .unsigned()
        .references('id')
        .inTable('tax_rates');
      table.decimal('tax_rate', 8, 4).unsigned();
      table.decimal('tax_amount', 15, 5);
      table.integer('order').unsigned().defaultTo(0);
      table.timestamps();
    })
    .then(() => {
      return knex.raw(`
        INSERT INTO ITEMS_ENTRIES_TAXES (ITEM_ENTRY_ID, TAX_RATE_ID, TAX_RATE, TAX_AMOUNT, \`ORDER\`, CREATED_AT, UPDATED_AT)
        SELECT ID, TAX_RATE_ID, TAX_RATE, NULL, 0, NOW(), NOW()
        FROM ITEMS_ENTRIES
        WHERE TAX_RATE_ID IS NOT NULL
      `);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('items_entries_taxes');
};
