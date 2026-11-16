/**
 * Stores each Plaid transaction once: a unique index on the Plaid transaction
 * id of the uncategorized bank transactions. MySQL unique indexes allow many
 * NULL values, so the transactions that are not from Plaid are unaffected.
 *
 * Nothing is deleted here. When duplicated Plaid transaction ids are stored
 * already the index is left out with a warning, so the server still starts
 * (the sync itself no longer stores a Plaid transaction twice); remove the
 * duplicates and add the index by hand, see `UNIQUE_INDEX_NAME`.
 */
const UNIQUE_INDEX_NAME = 'uncategorized_cashflow_trans_plaid_trans_id_unique';

exports.up = async function (knex) {
  const duplicates = await knex('uncategorized_cashflow_transactions')
    .select('plaid_transaction_id')
    .count('* as count')
    .whereNotNull('plaid_transaction_id')
    .groupBy('plaid_transaction_id')
    .havingRaw('count(*) > 1');

  if (duplicates.length > 0) {
    console.warn(
      `[migration] ${duplicates.length} Plaid transaction ids are stored more than once in uncategorized_cashflow_transactions; the unique index ${UNIQUE_INDEX_NAME} is not added.`,
    );
    return;
  }
  return knex.schema.alterTable(
    'uncategorized_cashflow_transactions',
    (table) => {
      table.unique(['plaid_transaction_id'], {
        indexName: UNIQUE_INDEX_NAME,
      });
    },
  );
};

exports.down = async function (knex) {
  const hasIndex = await knex
    .raw(`SHOW INDEX FROM ?? WHERE Key_name = ?`, [
      'uncategorized_cashflow_transactions',
      UNIQUE_INDEX_NAME,
    ])
    .then(([rows]) => rows.length > 0);

  if (!hasIndex) {
    return;
  }
  return knex.schema.alterTable(
    'uncategorized_cashflow_transactions',
    (table) => {
      table.dropUnique(['plaid_transaction_id'], UNIQUE_INDEX_NAME);
    },
  );
};
