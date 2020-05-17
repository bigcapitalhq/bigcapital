
exports.up = function (knex) {
  return knex.schema.createTable('view_roles', (table) => {
    table.increments();
    table.integer('index');
    table.integer('field_id').unsigned();
    table.string('comparator');
    table.string('value');
    table.integer('view_id').unsigned();
  }).raw('ALTER TABLE `VIEW_ROLES` AUTO_INCREMENT = 1000').then(() => {
    return knex.seed.run({
      specific: 'seed_views_roles.js',
    });
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('view_roles');
