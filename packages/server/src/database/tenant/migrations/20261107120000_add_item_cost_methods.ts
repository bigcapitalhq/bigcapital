/**
 * Adds the item-level cost method and the lock timestamp that freezes the
 * cost method once the item has its first inventory transaction.
 *
 * Also makes the item category cost method nullable (null means inherit from
 * the global `items.default_cost_method` preference) and backfills the items
 * that already have inventory transactions.
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('items', (table) => {
    table.string('cost_method', 10).nullable().after('category_id');
    table.datetime('cost_method_locked_at').nullable().after('cost_method');
  });

  await knex.schema.alterTable('items_categories', (table) => {
    table.string('cost_method').nullable().defaultTo(null).alter();
  });

  // Add the global default cost method setting for existing tenants so the
  // preference shows up in the API/UI even before it is saved.
  const existingSetting = await knex('settings')
    .where({ group: 'items', key: 'default_cost_method' })
    .first();

  if (!existingSetting) {
    await knex('settings').insert({
      group: 'items',
      key: 'default_cost_method',
      value: 'AVG',
    });
  }

  // Freeze the cost method of inventory items that already have inventory
  // transactions. The item category method wins, then the global preference.
  await knex.raw(`
    UPDATE ITEMS i
    INNER JOIN (
      SELECT ITEM_ID, MIN(DATE) AS FIRST_DATE
      FROM INVENTORY_TRANSACTIONS
      GROUP BY ITEM_ID
    ) t ON t.ITEM_ID = i.ID
    LEFT JOIN ITEMS_CATEGORIES c ON c.ID = i.CATEGORY_ID
    LEFT JOIN (
      SELECT VALUE
      FROM SETTINGS
      WHERE \`GROUP\` = 'items' AND \`KEY\` = 'default_cost_method'
      LIMIT 1
    ) s ON 1 = 1
    SET i.COST_METHOD = CASE
      WHEN UPPER(c.COST_METHOD) IN ('AVG', 'FIFO', 'LIFO') THEN UPPER(c.COST_METHOD)
      WHEN UPPER(s.VALUE) IN ('AVG', 'FIFO', 'LIFO') THEN UPPER(s.VALUE)
      ELSE 'AVG'
    END,
    i.COST_METHOD_LOCKED_AT = t.FIRST_DATE
    WHERE i.TYPE = 'inventory'
  `);
};

exports.down = async function (knex) {
  await knex('settings')
    .where({ group: 'items', key: 'default_cost_method' })
    .delete();

  await knex.schema.alterTable('items', (table) => {
    table.dropColumn('cost_method_locked_at');
    table.dropColumn('cost_method');
  });

  await knex.schema.alterTable('items_categories', (table) => {
    table.string('cost_method').defaultTo('AVG').alter();
  });
};
