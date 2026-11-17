const RECURRING_JOURNAL_ABILITIES = ['View', 'Create', 'Edit', 'Delete'];
const RECURRING_JOURNAL_SUBJECT = 'RecurringJournal';

/**
 * Grants the predefined staff role access to the recurring journals module.
 * Admin roles already have unrestricted access through the `manage all` rule.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const staffRoles = await knex('roles').where('slug', 'staff').select('id');

  for (const role of staffRoles) {
    for (const ability of RECURRING_JOURNAL_ABILITIES) {
      const existing = await knex('role_permissions')
        .where({
          role_id: role.id,
          subject: RECURRING_JOURNAL_SUBJECT,
          ability,
        })
        .first();

      if (!existing) {
        await knex('role_permissions').insert({
          role_id: role.id,
          subject: RECURRING_JOURNAL_SUBJECT,
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
    .where({ subject: RECURRING_JOURNAL_SUBJECT })
    .whereIn('ability', RECURRING_JOURNAL_ABILITIES)
    .del();
};
