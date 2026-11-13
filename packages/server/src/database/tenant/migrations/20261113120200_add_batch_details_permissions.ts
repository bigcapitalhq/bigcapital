const BATCH_DETAILS_ABILITY = 'read-batch-details';
const BATCH_DETAILS_SUBJECT = 'Report';

/**
 * Grants the predefined staff role access to the batch details report.
 * Admin roles already have unrestricted access through the `manage all` rule.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const staffRoles = await knex('roles').where('slug', 'staff').select('id');

  for (const role of staffRoles) {
    const existing = await knex('role_permissions')
      .where({
        role_id: role.id,
        subject: BATCH_DETAILS_SUBJECT,
        ability: BATCH_DETAILS_ABILITY,
      })
      .first();

    if (!existing) {
      await knex('role_permissions').insert({
        role_id: role.id,
        subject: BATCH_DETAILS_SUBJECT,
        ability: BATCH_DETAILS_ABILITY,
        value: true,
      });
    }
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex('role_permissions')
    .where({ subject: BATCH_DETAILS_SUBJECT, ability: BATCH_DETAILS_ABILITY })
    .del();
};
