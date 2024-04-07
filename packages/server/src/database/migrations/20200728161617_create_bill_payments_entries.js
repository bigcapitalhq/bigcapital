exports.up = (knex) =>
  knex.schema.createTable('bills_payments_entries', (table) => {
    table.increments();
    table.integer('bill_payment_id').unsigned().index().references('id').inTable('bills_payments');
    table.integer('bill_id').unsigned().index().references('id').inTable('bills');
    table.decimal('payment_amount', 13, 3).unsigned();
    table.integer('index').unsigned();
  });

exports.down = (knex) => knex.schema.dropTableIfExists('bills_payments_entries');
