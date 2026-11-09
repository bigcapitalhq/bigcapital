exports.up = function (knex) {
  return knex.schema.dropTableIfExists('storage');
};

exports.down = function (_knex) {};
