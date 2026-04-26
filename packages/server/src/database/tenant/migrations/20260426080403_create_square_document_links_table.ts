/**
 * Idempotency + back-reference table for Phase-2 Square handlers.
 *
 * Each row links a Square external object (payment, refund, payout,
 * invoice) to the Bigcapital document the handler created from it
 * (sale_receipt, credit_note, manual_journal, sale_invoice). The
 * (connection_id, square_object_type, square_object_id) unique
 * constraint enforces "exactly one document per Square object,"
 * which is what makes the handlers safe to re-run on the duplicate
 * `payment.created` → `payment.updated` events Square emits.
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('square_document_links', (table) => {
      table.increments('id');
      table.integer('connection_id').unsigned().notNullable();
      table.string('square_object_type', 32).notNullable();
      table.string('square_object_id', 128).notNullable();
      table.string('bigcapital_document_type', 32).notNullable();
      table.integer('bigcapital_document_id').unsigned().notNullable();
      // Optional pointer at the event-log row that triggered creation —
      // useful for audit + reprocess UX (Phase 3+).
      table.integer('source_event_log_id').unsigned().nullable();
      table.timestamps();

      // Explicit short name — Knex's UPPER snake-case mapper would
      // overshoot MySQL's 64-char identifier limit otherwise.
      table.unique(
        ['connection_id', 'square_object_type', 'square_object_id'],
        'uq_sq_doc_links_conn_type_id',
      );
      table.index(
        ['bigcapital_document_type', 'bigcapital_document_id'],
        'ix_sq_doc_links_bigcap_doc',
      );
    })
    .raw('ALTER TABLE `SQUARE_DOCUMENT_LINKS` AUTO_INCREMENT = 1000');
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('square_document_links');
};
