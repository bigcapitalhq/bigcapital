exports.up = function (knex) {
  return knex.schema.createTable('simplefin_items', (table) => {
    table.increments('id');
    table.integer('tenant_id').unsigned();
    // Application-generated identifier shared with the system `simplefin_items`
    // table and referenced by `accounts.simplefin_item_id`.
    table.string('simplefin_item_id').unique();
    // SimpleFIN access URL (contains the HTTP basic auth credentials).
    table.text('access_url');
    // Human-readable name of the SimpleFIN connection/institution.
    table.string('connection_name');
    table.datetime('last_synced_at').nullable();
    table.datetime('paused_at').nullable();
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('simplefin_items');
};
