
exports.up = function (knex) {
  return knex.schema.createTable('views', (table) => {
    table.increments();
    table.string('name').index();
    table.string('slug').index();
    table.boolean('predefined');
    table.string('resource_model').index();
    table.boolean('favourite');
    table.string('roles_logic_expression');
    table.timestamps();
  }).raw('ALTER TABLE `VIEWS` AUTO_INCREMENT = 1000');
};

exports.down = (knex) => knex.schema.dropTableIfExists('views');
