import config from '@/config';
import { ITenant } from '@/interfaces';

export const tenantKnexConfig = (tenant: ITenant) => {
  const { organizationId, id } = tenant;

  return {
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
      tableName: 'bigcapital_seeds',
      directory: config.tenant.seeds_dir,
    },
    pool: { min: 0, max: 5 },
    userParams: {
      tenantId: id,
      organizationId
    }
  };
};

export const systemKnexConfig = {
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
};

export const systemDbManager = {
  collate: [],
  superUser: config.manager.superUser,
  superPassword: config.manager.superPassword,
};

export const tenantSeedConfig = (tenant: ITenant) => {
  return {
    directory: config.tenant.seeds_dir,
  };
}