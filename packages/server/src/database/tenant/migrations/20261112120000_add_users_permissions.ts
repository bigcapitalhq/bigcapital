/**
 * Adds the user management permissions.
 *
 * The `User` subject controls who can list, invite, edit and delete the
 * workspace members. Only the `View` ability is granted to the existing
 * non-admin roles to keep the member directory readable (it is used by other
 * product features such as the items reorder-point notifications), while any
 * create/edit/delete operation stays restricted to the administrator role.
 *
 * Admin roles already have unrestricted access through the `manage all` rule.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Custom roles have a null slug, only the predefined admin role (slug
  // `admin`) is excluded since it already has the `manage all` rule.
  const nonAdminRoles = await knex('roles')
    .where((builder) => {
      builder.whereNull('slug').orWhereNot('slug', 'admin');
    })
    .select('id');

  for (const role of nonAdminRoles) {
    const existing = await knex('role_permissions')
      .where({ role_id: role.id, subject: 'User', ability: 'View' })
      .first();

    if (!existing) {
      await knex('role_permissions').insert({
        role_id: role.id,
        subject: 'User',
        ability: 'View',
        value: true,
      });
    }
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex('role_permissions').where({ subject: 'User' }).del();
};
