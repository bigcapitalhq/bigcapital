exports.up = (knex) => {
  return knex.schema.table('users', (table) => {
    table.string('google_id', 255).nullable().unique();
  });
};

exports.down = (knex) => {
  return knex.schema.table('users', (table) => {
    table.dropColumn('google_id');
  });
};
