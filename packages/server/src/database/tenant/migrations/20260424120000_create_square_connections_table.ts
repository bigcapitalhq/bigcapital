exports.up = function (knex) {
  return knex.schema
    .createTable('square_connections', (table) => {
      table.increments('id');
      table.string('merchant_id', 64).notNullable();
      table.string('environment', 16).notNullable().defaultTo('production');
      // Encrypted tokens (AES-256-GCM). Format: base64(iv):base64(authTag):base64(ciphertext).
      table.text('access_token_encrypted').nullable();
      table.text('refresh_token_encrypted').nullable();
      table.dateTime('token_expires_at').nullable();
      // Generated per connection; used both to verify inbound webhooks and to
      // sign outbound registrations.
      table.string('webhook_signature_key', 128).notNullable();
      table.string('square_webhook_subscription_id', 128).nullable();
      // Accounts picked in the wizard.
      table.integer('clearing_account_id').unsigned().nullable();
      table.integer('fees_expense_account_id').unsigned().nullable();
      table.integer('tips_liability_account_id').unsigned().nullable();
      // Customer fallback for anonymous walk-in sales.
      table.integer('walk_in_customer_id').unsigned().nullable();
      // Bigcapital bank account that receives Square payouts; used for deposit
      // auto-match in Phase 3.
      table.integer('deposit_bank_account_id').unsigned().nullable();
      // pending (oauth done, wizard incomplete) | active | disabled.
      table.string('status', 16).notNullable().defaultTo('pending');
      table.text('status_message').nullable();
      table.dateTime('connected_at').nullable();
      table.dateTime('disconnected_at').nullable();
      table.timestamps();

      table.unique(['merchant_id', 'environment']);
      table.index(['status']);
    })
    .raw('ALTER TABLE `SQUARE_CONNECTIONS` AUTO_INCREMENT = 1000');
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('square_connections');
};
