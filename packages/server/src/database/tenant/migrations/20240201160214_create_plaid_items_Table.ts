exports.up = function (knex) {
  return knex.schema.createTable('plaid_items', (table) => {
    table.increments('id');
    table.integer('tenant_id').unsigned();
    table.string('plaid_item_id');
    table.string('plaid_institution_id');
    table.string('plaid_access_token');
    table.string('last_cursor');
    table.string('status');
    table.timestamps();
  });
};

exports.down = function (knex) {};
