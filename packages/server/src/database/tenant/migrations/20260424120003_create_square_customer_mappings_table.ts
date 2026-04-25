exports.up = function (knex) {
  return knex.schema
    .createTable('square_customer_mappings', (table) => {
      table.increments('id');
      table
        .integer('connection_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('square_connections')
        .onDelete('CASCADE');
      table.string('square_customer_id', 128).notNullable();
      table
        .integer('customer_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('contacts');
      table.boolean('auto_created').notNullable().defaultTo(false);
      table.timestamps();

      // Explicit name — default auto-generated name is right at the
      // MySQL 64-char identifier limit once the upperCase snake-case
      // mapper is applied.
      table.unique(
        ['connection_id', 'square_customer_id'],
        'uq_sq_cust_map_conn_cust',
      );
    })
    .raw('ALTER TABLE `SQUARE_CUSTOMER_MAPPINGS` AUTO_INCREMENT = 1000');
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('square_customer_mappings');
};
