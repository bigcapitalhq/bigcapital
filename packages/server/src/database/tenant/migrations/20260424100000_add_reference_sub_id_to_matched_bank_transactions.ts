exports.up = function (knex) {
  return knex.schema.alterTable('matched_bank_transactions', (table) => {
    table
      .integer('reference_sub_id')
      .unsigned()
      .nullable()
      .index();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('matched_bank_transactions', (table) => {
    table.dropColumn('reference_sub_id');
  });
};
