exports.up = function (knex) {
  return knex.schema.alterTable('contacts', (table) => {
    table.dropUnique('code');
    table.unique(['code', 'contact_service']);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('contacts', (table) => {
    table.dropUnique(['code', 'contact_service']);
    table.unique('code');
  });
};
