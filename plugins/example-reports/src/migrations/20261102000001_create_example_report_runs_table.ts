import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable(
    'ext_bigcapital_example_reports_runs',
    (table) => {
      table.bigIncrements('id');
      table.string('report_id', 128).notNullable();
      table.string('organization_id', 64).notNullable();
      table.json('parameters').nullable();
      table.dateTime('created_at').nullable();
      table.index(['report_id'], 'idx_example_report_runs_report');
    },
  );
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('ext_bigcapital_example_reports_runs');
};
