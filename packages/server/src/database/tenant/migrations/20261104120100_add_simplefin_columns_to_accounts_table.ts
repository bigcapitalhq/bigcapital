exports.up = function (knex) {
  return knex.schema.table('accounts', (table) => {
    table.string('simplefin_item_id').nullable().index();
    table.string('simplefin_account_id').nullable().index();
  });
};

exports.down = function (knex) {
  return knex.schema.table('accounts', (table) => {
    table.dropColumn('simplefin_item_id');
    table.dropColumn('simplefin_account_id');
  });
};
