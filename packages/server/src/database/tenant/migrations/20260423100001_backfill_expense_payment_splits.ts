exports.up = async function (knex) {
  const alreadyBackfilled = await knex('expense_payment_splits')
    .distinct('expense_id')
    .then((rows) => new Set(rows.map((r) => r.expense_id)));

  const rows = await knex('expenses_transactions')
    .select('id', 'payment_account_id', 'total_amount')
    .whereNotNull('payment_account_id');

  const now = knex.fn.now();
  const splits = rows
    .filter((row) => !alreadyBackfilled.has(row.id))
    .map((row) => ({
      expense_id: row.id,
      payment_account_id: row.payment_account_id,
      index: 1,
      amount: row.total_amount || 0,
      created_at: now,
      updated_at: now,
    }));

  if (splits.length === 0) return;

  await knex.batchInsert('expense_payment_splits', splits, 500);
};

exports.down = async function (knex) {
  await knex('expense_payment_splits').delete();
};
