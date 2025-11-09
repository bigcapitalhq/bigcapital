
exports.up = function(knex) {
  return knex.schema.createTable('inventory_adjustments', table => {
    table.increments();
    table.date('date').index();
    table.string('type').index();
    table.integer('adjustment_account_id').unsigned().references('id').inTable('accounts');
    table.string('reason');
    table.string('reference_no').index();
    table.string('description');
    table.integer('user_id').unsigned();
    table.date('published_at');
    table.timestamps();
  });  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('inventory_adjustments');
};
