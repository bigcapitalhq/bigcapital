exports.up = function (knex) {
  return knex.raw(`
    INSERT IGNORE INTO USER_TENANTS (USER_ID, TENANT_ID, ROLE, CREATED_AT, UPDATED_AT)
    SELECT ID, TENANT_ID, 'owner', CREATED_AT, UPDATED_AT
    FROM   USERS
    WHERE  TENANT_ID IS NOT NULL
  `);
};

exports.down = function () {
  // Cannot safely reverse a backfill.
  return Promise.resolve();
};
