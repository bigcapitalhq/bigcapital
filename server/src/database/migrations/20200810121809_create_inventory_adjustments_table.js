
exports.up = function(knex) {
  return knex.schema.createTable('inventory_adjustments', table => {
    table.increments();
    table.date('date').index();
    table.string('type').index();
    table.string('reason');
    table.string('reference_no').index();
    table.string('description');
  });  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('inventory_adjustments');
};
