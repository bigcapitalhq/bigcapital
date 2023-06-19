#!/usr/bin/env node
import commander from 'commander';
import color from 'colorette';
import argv from 'getopts';
import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import '../before';
import config from '../config';

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

function getAllSystemTenants(knex) {
  return knex('tenants');
}

// module.exports = {
//   log,
//   success,
//   exit,
//   initSystemKnex,
// };

// - bigcapital system:migrate:latest
// - bigcapital system:migrate:rollback
// - bigcapital tenants:migrate:latest
// - bigcapital tenants:migrate:latest --tenant_id=XXX
// - bigcapital tenants:migrate:rollback
// - bigcapital tenants:migrate:rollback --tenant_id=XXX
// - bigcapital tenants:migrate:make
// - bigcapital system:migrate:make
// - bigcapital tenants:list

commander
  .command('system:migrate:rollback')
  .description('Migrate the system database of the application.')
  .action(async () => {
    try {
      const sysKnex = await initSystemKnex();
      const [batchNo, _log] = await sysKnex.migrate.rollback();

      if (_log.length === 0) {
        success(color.cyan('Already at the base migration'));
      }
      success(
        color.green(`Batch ${batchNo} rolled back: ${_log.length} migrations`) +
          (argv.verbose ? `\n${color.cyan(_log.join('\n'))}` : '')
      );
    } catch (error) {
      exit(error);
    }
  });

commander
  .command('system:migrate:latest')
  .description('Migrate latest migration of the system database.')
  .action(async () => {
    try {
      const sysKnex = await initSystemKnex();
      const [batchNo, log] = await sysKnex.migrate.latest();

      if (log.length === 0) {
        success(color.cyan('Already up to date'));
      }
      success(
        color.green(`Batch ${batchNo} run: ${log.length} migrations`) +
          (argv.verbose ? `\n${color.cyan(log.join('\n'))}` : '')
      );
    } catch (error) {
      exit(error);
    }
  });

commander
  .command('system:migrate:make <name>')
  .description('Created a named migration file to the system database.')
  .action(async (name) => {
    const sysKnex = await initSystemKnex();

    sysKnex.migrate
      .make(name)
      .then((name) => {
        success(color.green(`Created Migration: ${name}`));
      })
      .catch(exit);
  });

commander
  .command('tenants:list')
  .description('Retrieve a list of all system tenants databases.')
  .action(async (cmd) => {
    try {
      const sysKnex = await initSystemKnex();
      const tenants = await getAllSystemTenants(sysKnex);

      tenants.forEach((tenant) => {
        const dbName = `${config.tenant.db_name_prefix}${tenant.organizationId}`;
        console.log(
          `ID: ${tenant.id} | Organization ID: ${tenant.organizationId} | DB Name: ${dbName}`
        );
      });
    } catch (error) {
      exit(error);
    }
    success('---');
  });

commander
  .command('tenants:migrate:make <name>')
  .description('Created a named migration file to the tenants database.')
  .action(async (name) => {
    const sysKnex = await initTenantKnex();

    sysKnex.migrate
      .make(name)
      .then((name) => {
        success(color.green(`Created Migration: ${name}`));
      })
      .catch(exit);
  });

commander
  .command('tenants:migrate:latest')
  .description('Migrate all tenants or the given tenant id.')
  .option('-t, --tenant_id [tenant_id]', 'Which tenant id do you migrate.')
  .action(async (cmd) => {
    try {
      const sysKnex = await initSystemKnex();
      const tenants = await getAllSystemTenants(sysKnex);
      const tenantsOrgsIds = tenants.map((tenant) => tenant.organizationId);

      if (cmd.tenant_id && tenantsOrgsIds.indexOf(cmd.tenant_id) === -1) {
        exit(`The given tenant id ${cmd.tenant_id} is not exists.`);
      }
      // Validate the tenant id exist first of all.
      const migrateOpers = [];
      const migrateTenant = async (organizationId) => {
        try {
          const tenantKnex = await initTenantKnex(organizationId);
          const [batchNo, _log] = await tenantKnex.migrate.latest();

          const tenantDb = `${config.tenant.db_name_prefix}${organizationId}`;

          if (_log.length === 0) {
            log(color.cyan('Already up to date'));
          }
          log(
            color.green(
              `Tenant ${tenantDb} > Batch ${batchNo} run: ${_log.length} migrations`
            ) + (argv.verbose ? `\n${color.cyan(log.join('\n'))}` : '')
          );
          log('-------------------');
        } catch (error) {
          log(error);
        }
      };
      if (!cmd.tenant_id) {
        tenants.forEach((tenant) => {
          const oper = migrateTenant(tenant.organizationId);
          migrateOpers.push(oper);
        });
      } else {
        const oper = migrateTenant(cmd.tenant_id);
        migrateOpers.push(oper);
      }

      Promise.all(migrateOpers).then(() => {
        success('All tenants are migrated.');
      });
    } catch (error) {
      exit(error);
    }
  });

commander
  .command('tenants:migrate:rollback')
  .description('Rollback the last batch of tenants migrations.')
  .option('-t, --tenant_id [tenant_id]', 'Which tenant id do you migrate.')
  .action(async (cmd) => {
    try {
      const sysKnex = await initSystemKnex();
      const tenants = await getAllSystemTenants(sysKnex);
      const tenantsOrgsIds = tenants.map((tenant) => tenant.organizationId);

      if (cmd.tenant_id && tenantsOrgsIds.indexOf(cmd.tenant_id) === -1) {
        exit(`The given tenant id ${cmd.tenant_id} is not exists.`);
      }

      const migrateOpers = [];
      const migrateTenant = async (organizationId) => {
        try {
          const tenantKnex = await initTenantKnex(organizationId);
          const [batchNo, _log] = await tenantKnex.migrate.rollback();
          const tenantDb = `${config.tenant.db_name_prefix}${organizationId}`;

          if (_log.length === 0) {
            log(color.cyan('Already at the base migration'));
          }
          log(
            color.green(
              `Tenant: ${tenantDb} > Batch ${batchNo} rolled back: ${_log.length} migrations`
            ) + (argv.verbose ? `\n${color.cyan(_log.join('\n'))}` : '')
          );
          log('---------------');
        } catch (error) {
          exit(error);
        }
      };

      if (!cmd.tenant_id) {
        tenants.forEach((tenant) => {
          const oper = migrateTenant(tenant.organizationId);
          migrateOpers.push(oper);
        });
      } else {
        const oper = migrateTenant(cmd.tenant_id);
        migrateOpers.push(oper);
      }
      Promise.all(migrateOpers).then(() => {
        success('All tenants are rollbacked.');
      });
    } catch (error) {
      exit(error);
    }
  });

