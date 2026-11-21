/**
 * Backfills warehouse balances from recorded movements and manual opening stock.
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  if (!(await knex.schema.hasTable('BATCH_WAREHOUSE_BALANCES'))) {
    await knex.schema.createTable('batch_warehouse_balances', (table) => {
      table.increments();
      table
        .integer('batch_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('batches')
        .onDelete('CASCADE');
      table
        .integer('warehouse_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('warehouses')
        .onDelete('RESTRICT');
      table.decimal('quantity_on_hand', 13, 3).notNullable().defaultTo(0);
      table.timestamps();
      table.unique(
        ['batch_id', 'warehouse_id'],
        'batch_warehouse_balance_unique',
      );
      table.index(['warehouse_id'], 'batch_warehouse_balance_warehouse_index');
    });
  }

  if (!(await knex.schema.hasColumn('batches', 'opening_warehouse_id'))) {
    await knex.schema.table('batches', (table) => {
      table
        .integer('opening_warehouse_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('warehouses')
        .onDelete('SET NULL');
    });
  }
  await knex.raw(`
    UPDATE BATCHES b JOIN WAREHOUSES w ON w.\`PRIMARY\` = 1
    SET b.OPENING_WAREHOUSE_ID = w.ID
    WHERE b.SOURCE_TRANSACTION_TYPE IS NULL AND b.OPENING_WAREHOUSE_ID IS NULL
  `);
  // Pin legacy movements to their backfilled location so later edits and
  // reversals still use it if another warehouse becomes primary.
  await knex.raw(`
    UPDATE INVENTORY_TRANSACTIONS t JOIN WAREHOUSES w ON w.\`PRIMARY\` = 1
    SET t.WAREHOUSE_ID = w.ID
    WHERE t.BATCH_ID IS NOT NULL AND t.WAREHOUSE_ID IS NULL
  `);
  await knex.raw(`
    INSERT INTO BATCH_WAREHOUSE_BALANCES (BATCH_ID, WAREHOUSE_ID, QUANTITY_ON_HAND)
    SELECT batch_id, warehouse_id, SUM(quantity_change)
    FROM (
      SELECT t.BATCH_ID AS batch_id, t.WAREHOUSE_ID AS warehouse_id,
             IF(t.DIRECTION = 'IN', COALESCE(t.QUANTITY, 0), -COALESCE(t.QUANTITY, 0)) AS quantity_change
      FROM INVENTORY_TRANSACTIONS t
      WHERE t.BATCH_ID IS NOT NULL
      UNION ALL
      SELECT b.ID, b.OPENING_WAREHOUSE_ID, b.QUANTITY
      FROM BATCHES b
      WHERE b.SOURCE_TRANSACTION_TYPE IS NULL
    ) movements
    WHERE warehouse_id IS NOT NULL
    GROUP BY batch_id, warehouse_id
    ON DUPLICATE KEY UPDATE QUANTITY_ON_HAND = VALUES(QUANTITY_ON_HAND)
  `);
};

exports.down = async function (knex) {
  await knex.schema.table('batches', (table) => {
    table.dropForeign('opening_warehouse_id');
    table.dropColumn('opening_warehouse_id');
  });
  await knex.schema.dropTableIfExists('batch_warehouse_balances');
};
