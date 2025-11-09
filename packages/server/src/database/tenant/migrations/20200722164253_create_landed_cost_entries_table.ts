exports.up = function (knex) {
  return knex.schema.createTable('bill_located_cost_entries', (table) => {
    table.increments();

    table.decimal('cost', 13, 3).unsigned();
    table.integer('entry_id').unsigned();
    table.integer('bill_located_cost_id').unsigned();
  });
};

exports.down = function (knex) {};
