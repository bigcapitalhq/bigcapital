/**
 * Creates (or upgrades) the custom fields schema.
 *
 * Custom field definitions are stored per resource (Customer, Vendor, Item,
 * SaleInvoice, Bill, Expense), and values are stored in a polymorphic
 * key/value table so entity tables do not need schema changes.
 *
 * The tenant Knex config maps identifiers to upper-case names, therefore the
 * existence checks use `information_schema` with case-insensitive matching.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const tableExists = async (knex, tableName) => {
  const [rows] = await knex.raw(
    `SELECT COUNT(*) AS count FROM information_schema.tables
     WHERE table_schema = DATABASE() AND LOWER(table_name) = ?`,
    [tableName.toLowerCase()],
  );
  return Number(rows[0]?.count ?? 0) > 0;
};

const columnExists = async (knex, tableName, columnName) => {
  const [rows] = await knex.raw(
    `SELECT COUNT(*) AS count FROM information_schema.columns
     WHERE table_schema = DATABASE() AND LOWER(table_name) = ?
       AND LOWER(column_name) = ?`,
    [tableName.toLowerCase(), columnName.toLowerCase()],
  );
  return Number(rows[0]?.count ?? 0) > 0;
};

exports.up = async function (knex) {
  if (!(await tableExists(knex, 'custom_fields'))) {
    await knex.schema.createTable('custom_fields', (table) => {
      table.increments();
      table.string('resource_name', 64).notNullable();
      table.string('field_name', 64).notNullable();
      table.string('label', 255).notNullable();
      table.string('data_type', 32).notNullable();
      table.text('help_text').nullable();
      table.string('placeholder', 255).nullable();
      table.boolean('required').notNullable().defaultTo(false);
      table.boolean('unique').notNullable().defaultTo(false);
      table.boolean('active').notNullable().defaultTo(true);
      table.json('default_value').nullable();
      table.json('options').nullable();
      table.string('input_format', 255).nullable();
      table.integer('min_length').nullable();
      table.integer('max_length').nullable();
      table.decimal('min_value', 18, 6).nullable();
      table.decimal('max_value', 18, 6).nullable();
      table.integer('sort_order').notNullable().defaultTo(0);
      table.timestamps();

      table.unique(
        ['resource_name', 'field_name'],
        'custom_fields_resource_field_unique',
      );
      table.index(
        ['resource_name', 'active', 'sort_order'],
        'custom_fields_resource_active_order_index',
      );
    });
  } else {
    // Upgrade the experimental schema from the old custom-fields branch.
    const hasColumn = (column) => columnExists(knex, 'custom_fields', column);

    if ((await hasColumn('field_type')) && !(await hasColumn('data_type'))) {
      await knex.schema.alterTable('custom_fields', (table) => {
        table.renameColumn('field_type', 'data_type');
      });
    }
    if ((await hasColumn('order')) && !(await hasColumn('sort_order'))) {
      await knex.schema.alterTable('custom_fields', (table) => {
        table.renameColumn('order', 'sort_order');
      });
    }
    const requiredColumns = [
      ['help_text', (table) => table.text('help_text').nullable()],
      ['placeholder', (table) => table.string('placeholder', 255).nullable()],
      ['unique', (table) => table.boolean('unique').defaultTo(false)],
      ['input_format', (table) => table.string('input_format', 255).nullable()],
      ['min_length', (table) => table.integer('min_length').nullable()],
      ['max_length', (table) => table.integer('max_length').nullable()],
      ['min_value', (table) => table.decimal('min_value', 18, 6).nullable()],
      ['max_value', (table) => table.decimal('max_value', 18, 6).nullable()],
      ['sort_order', (table) => table.integer('sort_order').defaultTo(0)],
    ];
    for (const [column, builder] of requiredColumns) {
      if (!(await hasColumn(column))) {
        await knex.schema.alterTable('custom_fields', builder);
      }
    }
  }

  if (!(await tableExists(knex, 'custom_field_values'))) {
    await knex.schema.createTable('custom_field_values', (table) => {
      table.increments();
      table.integer('custom_field_id').unsigned().notNullable();
      table.string('resource_name', 64).notNullable();
      table.integer('resource_id').unsigned().notNullable();

      table.text('value_text', 'mediumtext').nullable();
      table.decimal('value_number', 18, 6).nullable();
      table.boolean('value_boolean').nullable();
      table.date('value_date').nullable();
      table.json('value_json').nullable();
      table.timestamps();

      table.unique(
        ['custom_field_id', 'resource_name', 'resource_id'],
        'custom_field_values_field_resource_unique',
      );
      table.index(
        ['resource_name', 'resource_id'],
        'custom_field_values_resource_index',
      );
      table
        .foreign('custom_field_id', 'custom_field_values_custom_field_fk')
        .references('custom_fields.id')
        .onDelete('CASCADE');
    });
  } else {
    const hasColumn = (column) =>
      columnExists(knex, 'custom_field_values', column);

    if (!(await hasColumn('resource_name'))) {
      await knex.schema.alterTable('custom_field_values', (table) => {
        table.string('resource_name', 64).nullable();
      });
      if (await hasColumn('resource_type')) {
        await knex.raw(
          'UPDATE CUSTOM_FIELD_VALUES SET RESOURCE_NAME = RESOURCE_TYPE WHERE RESOURCE_NAME IS NULL',
        );
      }
    }
    const requiredColumns = [
      [
        'value_text',
        (table) => table.text('value_text', 'mediumtext').nullable(),
      ],
      [
        'value_number',
        (table) => table.decimal('value_number', 18, 6).nullable(),
      ],
      ['value_boolean', (table) => table.boolean('value_boolean').nullable()],
      ['value_date', (table) => table.date('value_date').nullable()],
      ['value_json', (table) => table.json('value_json').nullable()],
    ];
    for (const [column, builder] of requiredColumns) {
      if (!(await hasColumn(column))) {
        await knex.schema.alterTable('custom_field_values', builder);
      }
    }
    if ((await hasColumn('value')) && (await hasColumn('value_text'))) {
      await knex.raw(
        'UPDATE CUSTOM_FIELD_VALUES SET VALUE_TEXT = VALUE WHERE VALUE_TEXT IS NULL',
      );
    }
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('custom_field_values');
  await knex.schema.dropTableIfExists('custom_fields');
};
