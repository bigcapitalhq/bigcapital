import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import color from 'colorette';
import config from '../src/config';
// import { systemKnexConfig } from '../src/config/knexConfig';

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

function getDeepValue(prop, obj) {
  if (!Object.keys(obj).length) { return []; }

  return Object.entries(obj).reduce((acc, [key, val]) => {
    if (key === prop) {
      acc.push(val);
    } else {
      acc.push(Array.isArray(val) ? val.map(getIds).flat() : getIds(val));
    }
    return acc.flat();
  }, []);
}

export {
  initTenantKnex,
  initSystemKnex,
  getAllSystemTenants,
  exit,
  success,
  log,
  getDeepValue,
}