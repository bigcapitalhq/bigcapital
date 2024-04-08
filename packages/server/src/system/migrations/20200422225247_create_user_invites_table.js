exports.up = (knex) =>
  knex.schema.createTable('user_invites', (table) => {
    table.increments();
    table.string('email').index();
    table.string('token').unique().index();
    table.bigInteger('tenant_id').unsigned().index().references('id').inTable('tenants');
    table.integer('user_id').unsigned().index().references('id').inTable('users');
    table.datetime('created_at');
  });

exports.down = (knex) => knex.schema.dropTableIfExists('user_invites');
