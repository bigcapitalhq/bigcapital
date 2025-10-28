exports.up = function (knex) {
    return knex.schema.createTable('inventory_transaction_meta', (table) => {
      table.increments('id');
      table.string('transaction_number');
      table.text('description');
      table.integer('inventory_transaction_id').unsigned();
    });
  };
  
  exports.down = function (knex) {};
  