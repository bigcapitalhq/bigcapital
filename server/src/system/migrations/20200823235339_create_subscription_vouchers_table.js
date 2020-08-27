
exports.up = function(knex) {
  return knex.schema.createTable('subscription_vouchers', table => {
    table.increments();

    table.string('voucher_code').unique();
    table.integer('plan_id').unsigned();

    table.integer('voucher_period').unsigned();
    table.string('period_interval');

    table.boolean('sent').defaultTo(false);
    table.boolean('disabled').defaultTo(false);
    table.boolean('used').defaultTo(false);

    table.dateTime('sent_at');
    table.dateTime('disabled_at');
    table.dateTime('used_at');

    table.timestamps();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('subscription_vouchers');
};
