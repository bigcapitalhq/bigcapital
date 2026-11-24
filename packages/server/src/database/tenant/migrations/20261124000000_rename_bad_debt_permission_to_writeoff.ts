// The server checks the `Writeoff` ability on invoices, but the role editor
// used to store it as `bad-debt`, so those grants never took effect.
exports.up = function (knex) {
  return knex('role_permissions')
    .where({ subject: 'SaleInvoice', ability: 'bad-debt' })
    .update({ ability: 'Writeoff' });
};

exports.down = function (knex) {
  return knex('role_permissions')
    .where({ subject: 'SaleInvoice', ability: 'Writeoff' })
    .update({ ability: 'bad-debt' });
};
