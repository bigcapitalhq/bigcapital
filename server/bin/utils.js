const Knex = require('knex');
const { knexSnakeCaseMappers } = require('objection');
const color = require('colorette');
const config = require('../config/config');
const systemConfig = require('../config/systemKnexfile');


function initSystemKnex() {
  return Knex({
    ...systemConfig['production'],
    ...knexSnakeCaseMappers({ upperCase: true }),
  });
}

function getAllSystemTenants(knex) {
  return knex('tenants');
}

function initTenantKnex(organizationId) {
  return Knex({
    client: config.tenant.db_client,
    connection: {
      host: config.tenant.db_host,
      user: config.tenant.db_user,
      password: config.tenant.db_password,
      database: `${config.tenant.db_name_prefix}${organizationId}`,
      charset: config.tenant.charset,
    },
    migrations: {
      directory: config.tenant.migrations_dir,
    },
    seeds: {
      directory: config.tenant.seeds_dir,
    },
    pool: { min: 0, max: 5 },
    ...knexSnakeCaseMappers({ upperCase: true }),
  })
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
  initTenantKnex,
  initSystemKnex,
  getAllSystemTenants,
  exit,
  success,
  log,
}