exports.up = function (knex) {
  return knex.schema
    .createTable('square_event_log', (table) => {
      table.increments('id');
      table
        .integer('connection_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('square_connections')
        .onDelete('CASCADE');
      table.string('square_event_id', 128).notNullable();
      table.string('event_type', 64).notNullable();
      // 'webhook' | 'backfill' | 'manual_reprocess'
      table.string('source', 32).notNullable().defaultTo('webhook');
      table.json('payload').nullable();
      // received | processing | done | failed | skipped_duplicate
      table.string('status', 32).notNullable().defaultTo('received');
      table.text('error_text').nullable();
      // When an event creates a Bigcapital record, these track it.
      table.string('created_reference_type', 64).nullable();
      table.integer('created_reference_id').unsigned().nullable();
      table.dateTime('received_at').notNullable().defaultTo(knex.fn.now());
      table.dateTime('processed_at').nullable();
      table.timestamps();

      // Idempotency: a given Square event id is processed once per connection.
      table.unique(['connection_id', 'square_event_id']);
      table.index(['status']);
      table.index(['event_type']);
    })
    .raw('ALTER TABLE `SQUARE_EVENT_LOG` AUTO_INCREMENT = 1000');
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('square_event_log');
};
