/**
 * Fixes the account names of the auto-created multi-currency
 * accounts receivable/payable accounts.
 *
 * These accounts used to be created with the raw i18n keys as their names
 * because the translation keys were missing from the server translations.
 */
const untranslatedNames = {
  'account.accounts_receivable.currency': 'Accounts Receivable',
  'account.accounts_payable.currency': 'Accounts Payable',
};

exports.up = async function (knex) {
  const accounts = await knex('accounts')
    .whereIn('name', Object.keys(untranslatedNames))
    .select('id', 'name', 'currency_code');

  for (const account of accounts) {
    const label = untranslatedNames[account.name];
    const name = account.currencyCode
      ? `${label} (${account.currencyCode})`
      : label;

    await knex('accounts').where('id', account.id).update({ name });
  }
};

exports.down = function (_knex) {
  return Promise.resolve();
};
