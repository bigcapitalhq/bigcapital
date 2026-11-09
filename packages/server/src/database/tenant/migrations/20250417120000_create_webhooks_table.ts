import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('webhooks', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('url', 5000).notNullable();
    table.string('secret', 255).nullable();
    table.string('entity', 100).notNullable();
    table.json('events').notNullable();
    table.enum('method', ['POST', 'PUT', 'DELETE']).defaultTo('POST');
    table.json('headers').nullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('webhook_deliveries', (table) => {
    table.increments('id').primary();
    table.integer('webhook_id').unsigned().notNullable().references('id').inTable('webhooks').onDelete('CASCADE');
    table.string('event_type', 255).notNullable();
    table.json('payload').notNullable();
    table.integer('response_status').nullable();
    table.text('response_body').nullable();
    table.integer('attempt_count').defaultTo(1);
    table.text('error_message').nullable();
    table.timestamp('delivered_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('webhook_deliveries');
  await knex.schema.dropTableIfExists('webhooks');
}
