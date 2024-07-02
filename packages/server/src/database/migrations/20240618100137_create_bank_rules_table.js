exports.up = function (knex) {
  return knex.schema
    .createTable('bank_rules', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.integer('order').unsigned();

      table
        .integer('apply_if_account_id')
        .unsigned()
        .references('id')
        .inTable('accounts');
      table.string('apply_if_transaction_type');

      table.string('assign_category');
      table
        .integer('assign_account_id')
        .unsigned()
        .references('id')
        .inTable('accounts');
      table.string('assign_payee');
      table.string('assign_memo');

      table.string('conditions_type');

      table.timestamps();
    })
    .createTable('bank_rule_conditions', (table) => {
      table.increments('id').primary();
      table
        .integer('rule_id')
        .unsigned()
        .references('id')
        .inTable('bank_rules');
      table.string('field');
      table.string('comparator');
      table.string('value');
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('bank_rules')
    .dropTableIfExists('bank_rule_conditions');
};
