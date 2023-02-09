const Knex = require('knex');
const { knexSnakeCaseMappers } = require('objection');
const color = require('colorette');
const config = require('./config');

function initSystemKnex() {
  return Knex({
    client: config.system.db_client,
    connection: {
      host: config.system.db_host,
      user: config.system.db_user,
      password: config.system.db_password,
      database: config.system.db_name,
      charset: 'utf8',
    },
    migrations: {
      directory: config.system.migrations_dir,
    },
    seeds: {
      directory: config.system.seeds_dir,
    },
    pool: { min: 0, max: 7 },
    ...knexSnakeCaseMappers({ upperCase: true }),
  });
}

function exit(text) {
  if (text instanceof Error) {
    console.error(
      color.red(`${text.detail ? `${text.detail}\n` : ''}${text.stack}`)
    );
  } else {
    console.error(color.red(text));
  }
  process.exit(1);
}

function success(text) {
  console.log(text);
  process.exit(0);
}
function log(text) {
  console.log(text);
}

module.exports = {
  log,
  success,
  exit,
  initSystemKnex,
};
