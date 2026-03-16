/**
 * Fix account type typos in the database.
 *
 * This migration corrects the following typos:
 * - 'none-current-asset' -> 'non-current-asset'
 *
 * Related GitHub issue: #1041
 */
exports.up = function (knex) {
  return knex('accounts')
    .where('account_type', 'none-current-asset')
    .update({ account_type: 'non-current-asset' });
};

exports.down = function (knex) {
  return knex('accounts')
    .where('account_type', 'non-current-asset')
    .update({ account_type: 'none-current-asset' });
};
