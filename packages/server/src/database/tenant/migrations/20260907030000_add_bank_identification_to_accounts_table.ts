exports.up = function (knex) {
  return knex.schema.table('accounts', (table) => {
    // Brazil: three digit bank code (COMPE), branch number of up to five
    // digits, and the account number including its trailing check digit.
    table.string('bank_code', 3).nullable();
    table.string('agency_number', 5).nullable();
    table.string('account_number', 20).nullable();

    // Argentina: the CBU is the canonical account identifier, 22 digits with
    // two check digits of its own, so it is stored whole rather than split.
    table.string('cbu', 22).nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('accounts', (table) => {
    table.dropColumn('bank_code');
    table.dropColumn('agency_number');
    table.dropColumn('account_number');
    table.dropColumn('cbu');
  });
};
