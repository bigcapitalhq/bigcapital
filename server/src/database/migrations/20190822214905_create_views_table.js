
exports.up = function (knex) {
  return knex.schema.createTable('views', (table) => {
    table.increments();
    table.string('name');
    table.boolean('predefined');
    table.integer('resource_id').unsigned().references('id').inTable('resources');
    table.boolean('favourite');
    table.string('roles_logic_expression');
    table.timestamps();
  }).raw('ALTER TABLE `VIEWS` AUTO_INCREMENT = 1000').then(() => {
    return knex.seed.run({
      specific: 'seed_views.js',
    });
  });
};

exports.down = (knex) => knex.schema.dropTableIfExists('views');
