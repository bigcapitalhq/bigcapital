/**
 * Stores batch on-hand quantities per warehouse. Existing balances are moved
 * into the primary warehouse; transaction history is then replayed by
 * warehouse so historical stock remains correctly located.
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
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
      .onDelete('CASCADE');
    table.decimal('quantity_on_hand', 13, 3).notNullable().defaultTo(0);
    table.timestamps();
    table.unique(
      ['batch_id', 'warehouse_id'],
      'batch_warehouse_balance_unique',
    );
    table.index(['warehouse_id'], 'batch_warehouse_balance_warehouse_index');
  });

  const [primary] = await knex('warehouses')
    .select('id')
    .where('primary', 1)
    .limit(1);
  if (!primary) return;

  const batches = await knex('batches').select(
    'id',
    'quantity',
    'source_transaction_type',
  );
  for (const batch of batches) {
    const totals = await knex('inventory_transactions')
      .where('batch_id', batch.id)
      .select('warehouse_id')
      .sum({
        quantity_in: knex.raw("IF(direction = 'IN', COALESCE(quantity, 0), 0)"),
      })
      .sum({
        quantity_out: knex.raw(
          "IF(direction = 'OUT', COALESCE(quantity, 0), 0)",
        ),
      })
      .groupBy('warehouse_id');
    const balances = new Map();

    totals.forEach((total) => {
      const warehouseId = total.warehouse_id || primary.id;
      const balance =
        Number(total.quantity_in || 0) - Number(total.quantity_out || 0);
      balances.set(warehouseId, (balances.get(warehouseId) || 0) + balance);
    });

    // Opening stock belongs to the primary warehouse, even when later
    // transactions for the batch were recorded in other warehouses.
    if (batch.source_transaction_type == null) {
      balances.set(
        primary.id,
        (balances.get(primary.id) || 0) + Number(batch.quantity || 0),
      );
    }
    if (balances.size === 0) balances.set(primary.id, 0);

    for (const [warehouseId, quantityOnHand] of balances) {
      await knex('batch_warehouse_balances').insert({
        batch_id: batch.id,
        warehouse_id: warehouseId,
        quantity_on_hand: quantityOnHand,
      });
    }
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('batch_warehouse_balances');
};
