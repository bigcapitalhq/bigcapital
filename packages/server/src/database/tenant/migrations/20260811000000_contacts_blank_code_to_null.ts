exports.up = function (knex) {
  return knex.raw("UPDATE `CONTACTS` SET `code` = NULL WHERE `code` = ''");
};

exports.down = function (knex) {
  return Promise.resolve();
};
