exports.up = function (knex) {
  return knex.transaction(async (trx) => {
    // Re-point recognized transactions referencing duplicated rows to the kept
    // (earliest) row per plaid_transaction_id before removing the duplicates.
    await trx.raw(`
      UPDATE recognized_bank_transactions AS r
      JOIN uncategorized_cashflow_transactions AS dup
        ON r.uncategorized_transaction_id = dup.id
      JOIN (
        SELECT plaid_transaction_id, MIN(id) AS keep_id
        FROM uncategorized_cashflow_transactions
        WHERE plaid_transaction_id IS NOT NULL
        GROUP BY plaid_transaction_id
        HAVING COUNT(*) > 1
      ) AS keep ON keep.plaid_transaction_id = dup.plaid_transaction_id
        AND keep.keep_id <> dup.id
      SET r.uncategorized_transaction_id = keep.keep_id
    `);
    // Mark the kept rows recognized when a recognized row now references them.
    await trx.raw(`
      UPDATE uncategorized_cashflow_transactions AS u
      JOIN recognized_bank_transactions AS r
        ON r.uncategorized_transaction_id = u.id
      SET u.recognized_transaction_id = COALESCE(u.recognized_transaction_id, r.id)
      WHERE u.plaid_transaction_id IS NOT NULL
    `);
    // Remove the duplicated rows keeping the earliest one per plaid_transaction_id.
    await trx.raw(`
      DELETE dup
      FROM uncategorized_cashflow_transactions AS dup
      JOIN uncategorized_cashflow_transactions AS keep
        ON dup.plaid_transaction_id = keep.plaid_transaction_id
       AND dup.plaid_transaction_id IS NOT NULL
       AND dup.id > keep.id
    `);
    // Enforce uniqueness of the plaid transactions ids. MySQL unique indexes
    // allow multiple NULL values so non-Plaid transactions are unaffected.
    await trx.schema.alterTable(
      'uncategorized_cashflow_transactions',
      (table) => {
        table.unique('plaid_transaction_id');
      },
    );
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable(
    'uncategorized_cashflow_transactions',
    (table) => {
      table.dropUnique('plaid_transaction_id');
    },
  );
};
