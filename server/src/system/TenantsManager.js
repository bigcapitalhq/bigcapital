import Knex from 'knex';
import Tenant from '@/system/models/Tenant';
import config from '@/../config/config';

export default class TenantsManager {

  constructor() {
    this.knexCache = new Map();
  }

  static async getTenant(organizationId) {
    const tenant = await Tenant.query()
      .where('organization_id', organizationId).first();

    return tenant;
  }

  /**
   * Retrieve all tenants metadata from system storage.
   */
  static getAllTenants() {
    return Tenant.query();
  }

  /**
   * Retrieve the given organization id knex configuration.
   * @param {String} organizationId -
   */
  static getTenantKnexConfig(organizationId) {
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
        directory: config.tenant.seeds_dir,
      },
    };
  }

  static knexInstance(organizationId) {
    const knexCache = new Map();
    let knex = knexCache.get(organizationId);

    if (!knex) {
      knex = Knex(this.getTenantKnexConfig(organizationId));
      knexCache.set(organizationId, knex);
    }
    return knex;
  }
}