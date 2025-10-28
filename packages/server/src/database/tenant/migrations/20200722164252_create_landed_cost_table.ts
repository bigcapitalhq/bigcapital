exports.up = function (knex) {
  return knex.schema.createTable('bill_located_costs', (table) => {
    table.increments();

    table.decimal('amount', 13, 3).unsigned();

    table.integer('fromTransactionId').unsigned();
    table.string('fromTransactionType');
    table.integer('fromTransactionEntryId').unsigned();

    table.string('allocationMethod');
    table.integer('costAccountId').unsigned();
    table.text('description');

    table.integer('billId').unsigned();

    table.timestamps();
  });
};

exports.down = function (knex) {};
