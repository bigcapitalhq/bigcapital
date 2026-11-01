exports.up = (knex) => {
  return knex.schema.createTable('audit_logs', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().nullable().index();
    table.string('action', 64).notNullable();
    table.string('subject', 64).notNullable();
    table.integer('subject_id').unsigned().nullable();
    table.json('metadata').nullable();
    table.string('ip', 64).nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    table.index(['subject', 'subject_id']);
    table.index(['created_at']);
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('audit_logs');
