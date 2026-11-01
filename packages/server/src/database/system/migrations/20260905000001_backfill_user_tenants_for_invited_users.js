/**
 * Backfills `user_tenants` membership for users who joined via an invite
 * and accepted before the invite flow started creating the membership row.
 * Such users have `invite_accepted_at` set but no `user_tenants` entry,
 * which prevents them from signing in.
 */
exports.up = function (knex) {
  return knex.raw(`
    INSERT IGNORE INTO USER_TENANTS (USER_ID, TENANT_ID, ROLE, CREATED_AT, UPDATED_AT)
    SELECT ID, TENANT_ID, 'member', CREATED_AT, UPDATED_AT
    FROM   USERS
    WHERE  INVITE_ACCEPTED_AT IS NOT NULL
      AND  TENANT_ID IS NOT NULL
  `);
};

exports.down = function () {
  // Cannot safely reverse a backfill.
  return Promise.resolve();
};
