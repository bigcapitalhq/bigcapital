import type { Knex } from 'knex';

const entryTables = [
  'inventory_adjustments_entries',
  'warehouses_transfers_entries',
];

export async function up(knex: Knex) {
  if (!(await knex.schema.hasColumn('items', 'inventory_tracking'))) {
    await knex.schema.alterTable('items', (table) => {
      table
        .enum('inventory_tracking', ['none', 'batches'])
        .notNullable()
        .defaultTo('none');
    });
  }
  for (const name of entryTables) {
    if (await knex.schema.hasColumn(name, 'batch_id')) continue;
    await knex.schema.alterTable(name, (table) => {
      table
        .integer('batch_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('batches')
        .onDelete('RESTRICT');
    });
  }
}

export async function down(knex: Knex) {
  for (const name of entryTables) {
    await knex.schema.alterTable(name, (table) => {
      table.dropForeign('batch_id');
      table.dropColumn('batch_id');
    });
  }
  await knex.schema.alterTable('items', (table) =>
    table.dropColumn('inventory_tracking'),
  );
}
