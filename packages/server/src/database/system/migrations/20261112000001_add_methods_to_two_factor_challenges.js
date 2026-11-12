/**
 * Multiple second-factor methods: a challenge remembers which methods were
 * offered, and which one completed (or is being set up).
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.table('auth_two_factor_challenges', (table) => {
    table.json('methods').nullable();
    table.string('method', 32).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.table('auth_two_factor_challenges', (table) => {
    table.dropColumn('methods');
    table.dropColumn('method');
  });
};
