exports.up = (knex) => {
  return knex.schema.table('users', (table) => {
    table.bigInteger('default_tenant_id').unsigned().nullable();
  });
};

exports.down = (knex) => {
  return knex.schema.table('users', (table) => {
    table.dropColumn('default_tenant_id');
  });
};
