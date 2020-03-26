
exports.up = function (knex) {
  return knex.schema.createTable('resources', (table) => {
    table.increments();
    table.string('name');
  }).then(() => {
    return knex.seed.run({
      specific: 'seed_resources.js',
    });
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('resources');
};
