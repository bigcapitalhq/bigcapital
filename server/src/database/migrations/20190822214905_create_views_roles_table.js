
exports.up = function (knex) {
  return knex.schema.createTable('view_roles', (table) => {
    table.increments();
    table.integer('index');
    table.integer('field_id').unsigned();
    table.string('comparator');
    table.string('value');
    table.integer('view_id').unsigned();
  }).then(() => {
    return knex.seed.run({
      specific: 'seed_views_role.js',
    });
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('view_roles');
