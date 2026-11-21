/**
 * Creates the bank reconciliation tables.
 *
 * A reconciliation header stores the period and statement balances, while the
 * transaction rows only link the reconciliation to the journal-entry lines
 * (`accounts_transactions`) it cleared. The journal entry stays the single
 * source of truth for every ledger attribute; the link is the "reconciled"
 * marker itself.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('bank_reconciliations', (table) => {
    table.increments();
    table.integer('account_id').unsigned().notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.decimal('beginning_balance', 15, 5).notNullable().defaultTo(0);
    table.decimal('ending_balance', 15, 5).nullable();
    table.decimal('cleared_balance', 15, 5).notNullable().defaultTo(0);
    table.decimal('difference', 15, 5).notNullable().defaultTo(0);
    table.string('status', 20).notNullable().defaultTo('in_progress');
    table.json('draft_transactions').nullable();
    table.text('notes').nullable();
    table.integer('created_by').unsigned().nullable();
    table.datetime('reconciled_at').nullable();
    table.integer('reconciled_by').unsigned().nullable();
    table.datetime('voided_at').nullable();
    table.timestamps();

    table.index(['account_id', 'end_date'], 'bank_reconciliations_account_end');
    table.index(
      ['account_id', 'status'],
      'bank_reconciliations_account_status',
    );
    table
      .foreign('account_id', 'fk_bank_reconciliations_account')
      .references('accounts.id')
      .onDelete('RESTRICT');
  });

  await knex.schema.createTable('bank_reconciliation_transactions', (table) => {
    table.increments();
    table.integer('reconciliation_id').unsigned().notNullable();
    table.integer('account_id').unsigned().notNullable();
    table.integer('account_transaction_id').unsigned().notNullable();
    table.string('reference_type', 255).notNullable();
    table.integer('reference_id').unsigned().notNullable();
    table.integer('transaction_index').unsigned().notNullable().defaultTo(0);
    table.timestamps();

    table.unique(
      'account_transaction_id',
      'bank_recon_tx_account_transaction_unique',
    );
    table.unique(
      ['account_id', 'reference_type', 'reference_id', 'transaction_index'],
      'bank_recon_tx_reference_unique',
    );
    table.index(
      ['account_id', 'reconciliation_id'],
      'bank_recon_tx_account_reconciliation',
    );
    table.index('reconciliation_id', 'bank_recon_tx_reconciliation');
    table
      .foreign('reconciliation_id', 'fk_bank_recon_tx_reconciliation')
      .references('bank_reconciliations.id')
      .onDelete('CASCADE');
    table
      .foreign('account_id', 'fk_bank_recon_tx_account')
      .references('accounts.id')
      .onDelete('RESTRICT');
    table
      .foreign('account_transaction_id', 'fk_bank_recon_tx_account_transaction')
      .references('accounts_transactions.id')
      .onDelete('RESTRICT');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('bank_reconciliation_transactions');
  await knex.schema.dropTableIfExists('bank_reconciliations');
};
