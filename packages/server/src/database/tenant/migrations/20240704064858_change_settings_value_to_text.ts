exports.up = function (knex) {
  return knex.schema.table('settings', (table) => {
    table.text('value').alter();
  });
};

exports.down = (knex) => {
  return knex.schema.table('settings', (table) => {
    table.string('value').alter();
  });
};
