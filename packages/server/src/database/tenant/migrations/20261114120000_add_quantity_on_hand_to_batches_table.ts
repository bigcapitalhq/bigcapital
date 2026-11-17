/**
 * Adds the stored quantity on hand of each batch.
 *
 * The quantity is maintained from the inventory transactions as they are
 * created and deleted, which avoids aggregating the inventory transactions on
 * every batches list request.
 *
 * The opening quantity of a manually created batch is included in the on hand
 * quantity. Batches created for a transaction (e.g. a bill) start at zero and
 * are driven by their inventory transactions.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const hasQuantityOnHand = await knex.schema.hasColumn(
    'batches',
    'quantity_on_hand',
  );

  // The column is created separately from the backfill to keep retries safe
  // when a previous run added the column but failed before being recorded.
  if (!hasQuantityOnHand) {
    await knex.schema.table('batches', (table) => {
      table
        .decimal('quantity_on_hand', 13, 3)
        .notNullable()
        .defaultTo(0)
        .after('quantity');
    });
  }

  await knex.raw(`
    UPDATE \`BATCHES\` AS b
    LEFT JOIN (
      SELECT
        \`BATCH_ID\`,
        SUM(CASE WHEN \`DIRECTION\` = 'IN' THEN COALESCE(\`QUANTITY\`, 0) ELSE 0 END) AS \`TX_IN\`,
        SUM(CASE WHEN \`DIRECTION\` = 'OUT' THEN COALESCE(\`QUANTITY\`, 0) ELSE 0 END) AS \`TX_OUT\`
      FROM \`INVENTORY_TRANSACTIONS\`
      WHERE \`BATCH_ID\` IS NOT NULL
      GROUP BY \`BATCH_ID\`
    ) AS totals ON totals.\`BATCH_ID\` = b.\`ID\`
    SET b.\`QUANTITY_ON_HAND\` =
      COALESCE(totals.\`TX_IN\`, 0) +
      CASE
        WHEN b.\`SOURCE_TRANSACTION_TYPE\` IS NULL THEN b.\`QUANTITY\`
        ELSE 0
      END -
      COALESCE(totals.\`TX_OUT\`, 0)
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const hasQuantityOnHand = await knex.schema.hasColumn(
    'batches',
    'quantity_on_hand',
  );

  if (hasQuantityOnHand) {
    await knex.schema.table('batches', (table) => {
      table.dropColumn('quantity_on_hand');
    });
  }
};
