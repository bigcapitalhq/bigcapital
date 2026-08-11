exports.up = function (knex) {
  return knex.raw("UPDATE `contacts` SET `code` = NULL WHERE `code` = ''");
};

exports.down = function (knex) {
  return Promise.resolve();
};
