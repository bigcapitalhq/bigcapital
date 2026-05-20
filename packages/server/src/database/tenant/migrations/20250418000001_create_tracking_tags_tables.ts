exports.up = function(knex) {
  return knex.schema
    .createTable('tracking_tags', table => {
      table.increments();
      table.string('name').notNullable();
      table.string('description').nullable();
      table.boolean('active').defaultTo(true);
      table.timestamps();
      table.index(['active']);
      table.unique(['name']);
    })
    .createTable('tracking_tag_options', table => {
      table.increments();
      table.integer('tag_id').unsigned().notNullable();
      table.string('name').notNullable();
      table.boolean('active').defaultTo(true);
      table.timestamps();
      table.foreign('tag_id').references('tracking_tags.id').onDelete('CASCADE');
      table.unique(['tag_id', 'name']);
    })
    .createTable('item_entry_tracking_tags', table => {
      table.integer('item_entry_id').unsigned().notNullable();
      table.integer('tag_id').unsigned().notNullable();
      table.integer('option_id').unsigned().notNullable();
      table.timestamps();
      table.primary(['item_entry_id', 'tag_id']);
      table.foreign('item_entry_id').references('items_entries.id').onDelete('CASCADE');
      table.foreign('tag_id').references('tracking_tags.id').onDelete('CASCADE');
      table.foreign('option_id').references('tracking_tag_options.id').onDelete('CASCADE');
      table.index(['tag_id']);
      table.index(['option_id']);
    })
    .createTable('manual_journal_entry_tracking_tags', table => {
      table.integer('manual_journal_entry_id').unsigned().notNullable();
      table.integer('tag_id').unsigned().notNullable();
      table.integer('option_id').unsigned().notNullable();
      table.timestamps();
      table.primary(['manual_journal_entry_id', 'tag_id']);
      table.foreign('manual_journal_entry_id').references('manual_journals_entries.id').onDelete('CASCADE');
      table.foreign('tag_id').references('tracking_tags.id').onDelete('CASCADE');
      table.foreign('option_id').references('tracking_tag_options.id').onDelete('CASCADE');
      table.index(['tag_id']);
      table.index(['option_id']);
    })
    .createTable('account_transaction_tracking_tags', table => {
      table.integer('account_transaction_id').unsigned().notNullable();
      table.integer('tag_id').unsigned().notNullable();
      table.integer('option_id').unsigned().notNullable();
      table.timestamps();
      table.primary(['account_transaction_id', 'tag_id']);
      table.foreign('account_transaction_id').references('accounts_transactions.id').onDelete('CASCADE');
      table.foreign('tag_id').references('tracking_tags.id').onDelete('CASCADE');
      table.foreign('option_id').references('tracking_tag_options.id').onDelete('CASCADE');
      table.index(['tag_id']);
      table.index(['option_id']);
      table.index(['account_transaction_id']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('account_transaction_tracking_tags')
    .dropTableIfExists('manual_journal_entry_tracking_tags')
    .dropTableIfExists('item_entry_tracking_tags')
    .dropTableIfExists('tracking_tag_options')
    .dropTableIfExists('tracking_tags');
};
