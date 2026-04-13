exports.up = function (knex) {
  return knex.schema.createTable('notifications', (table) => {
    table.increments('id').comment('Auto-generated id');
    table.integer('user_id').unsigned().nullable().index();
    table.string('title').notNullable();
    table.text('message').notNullable();
    table.enum('type', ['success', 'info', 'warning', 'error']).defaultTo('info');
    table.enum('category', ['inventory', 'billing', 'system', 'export', 'report']).defaultTo('system');
    table.json('metadata').nullable();
    table.timestamp('read_at').nullable();
    table.timestamps();

    // Index for querying user's unread notifications efficiently
    table.index(['user_id', 'read_at']);
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('notifications');
