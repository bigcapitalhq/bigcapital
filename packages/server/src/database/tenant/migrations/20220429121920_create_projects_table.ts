exports.up = (knex) => {
  return knex.schema
    .createTable('projects', (table) => {
      table.increments('id').comment('Auto-generated id');
      table.string('name');
      table.integer('contact_id').unsigned();
      table.date('deadline');
      table.decimal('cost_estimate');
      table.string('status');
      table.timestamps();
    })
    .createTable('tasks', (table) => {
      table.increments('id').comment('Auto-generated id');
      table.string('name');
      table.string('charge_type');
      table.decimal('rate');
      table.decimal('estimate_hours').unsigned();
      table.decimal('actual_hours').unsigned();
      table.decimal('invoiced_hours').unsigned().default(0);
      table
        .integer('project_id')
        .unsigned()
        .references('id')
        .inTable('projects');
      table.timestamps();
    })
    .createTable('times', (table) => {
      table.increments('id').comment('Auto-generated id');
      table.integer('duration').unsigned();
      table.string('description');
      table.date('date');

      table.integer('taskId').unsigned().references('id').inTable('tasks');
      table
        .integer('project_id')
        .unsigned()
        .references('id')
        .inTable('projects');
      table.timestamps();
    })
    .table('accounts_transactions', (table) => {
      table
        .integer('projectId')
        .unsigned()
        .references('id')
        .inTable('projects');
    })
    .table('manual_journals_entries', (table) => {
      table
        .integer('projectId')
        .unsigned()
        .references('id')
        .inTable('projects');
    })
    .table('bills', (table) => {
      table
        .integer('projectId')
        .unsigned()
        .references('id')
        .inTable('projects');
      table.decimal('invoiced_amount').unsigned().defaultTo(0);
    })
    .table('items_entries', (table) => {
      table
        .integer('projectId')
        .unsigned()
        .references('id')
        .inTable('projects');

      table.integer('project_ref_id').unsigned();
      table.string('project_ref_type');
      table.decimal('project_ref_invoiced_amount').unsigned().defaultTo(0);
    })
    .table('sales_invoices', (table) => {
      table
        .integer('projectId')
        .unsigned()
        .references('id')
        .inTable('projects');
    })
    .table('expenses_transactions', (table) => {
      table
        .integer('projectId')
        .unsigned()
        .references('id')
        .inTable('projects');
      table.decimal('invoiced_amount').unsigned().defaultTo(0);
    });
};

exports.down = (knex) => {
  return knex.schema.dropTable('tasks');
};
