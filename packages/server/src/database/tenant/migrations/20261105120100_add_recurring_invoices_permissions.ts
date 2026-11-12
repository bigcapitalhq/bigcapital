const ABILITIES = ['View', 'Create', 'Edit', 'Delete'];
const SUBJECT = 'RecurringInvoice';

/**
 * Grants the predefined staff role access to the recurring invoices module.
 * Admin roles already have unrestricted access through the `manage all` rule.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const staffRoles = await knex('roles').where('slug', 'staff').select('id');

  for (const role of staffRoles) {
    for (const ability of ABILITIES) {
      const existing = await knex('role_permissions')
        .where({
          role_id: role.id,
          subject: SUBJECT,
          ability,
        })
        .first();

      if (!existing) {
        await knex('role_permissions').insert({
          role_id: role.id,
          subject: SUBJECT,
          ability,
          value: true,
        });
      }
    }
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex('role_permissions')
    .where({ subject: SUBJECT })
    .whereIn('ability', ABILITIES)
    .del();
};
