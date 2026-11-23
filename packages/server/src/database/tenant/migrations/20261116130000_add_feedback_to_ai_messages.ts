/**
 * Stores the user's like/dislike rating of an assistant response.
 *
 * The rating is nullable: `null` means the user has not rated the message or
 * cleared a previous rating. Feedback is scoped to the message row because
 * conversations are private to the user who created them.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('ai_messages', (table) => {
    table
      .string('feedback', 16)
      .nullable()
      .comment(
        "The user's rating of an assistant message: 'like' or 'dislike'",
      );
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('ai_messages', (table) => {
    table.dropColumn('feedback');
  });
};
