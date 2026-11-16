/**
 * Creates the AI assistant conversation storage.
 *
 * Conversations and messages live in the tenant database, so every
 * organization keeps its own assistant history. Messages are stored as AI SDK
 * UI message parts (camelCase JSON) and are private to the user who created
 * the conversation.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('ai_conversations', (table) => {
    table.increments('id').comment('Auto-generated id');

    // The system user id; the system users table lives in the system database,
    // so there is intentionally no cross-database foreign key here.
    table.integer('system_user_id').unsigned().notNullable().index();
    table.string('title', 255).nullable();
    table.timestamps();

    table.index(['system_user_id', 'updated_at']);
  });

  await knex.schema.createTable('ai_messages', (table) => {
    table.increments('id').comment('Auto-generated id');

    table
      .integer('conversation_id')
      .unsigned()
      .notNullable()
      .index()
      .references('id')
      .inTable('ai_conversations')
      .onDelete('CASCADE');

    table.string('message_id', 191).notNullable();
    table.string('role', 20).notNullable();
    table.json('parts').notNullable();
    table.text('content').nullable();
    table.json('metadata').nullable();
    table.timestamps();

    table.unique(['conversation_id', 'message_id']);
    table.index(['conversation_id', 'id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('ai_messages');
  await knex.schema.dropTableIfExists('ai_conversations');
};
