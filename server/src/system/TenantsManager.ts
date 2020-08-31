import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import { Service } from 'typedi';
import Tenant from '@/system/models/Tenant';
import config from '@/../config/config';
import TenantModel from '@/models/TenantModel';
import uniqid from 'uniqid';
import dbManager from '@/database/manager';
import { omit } from 'lodash';

import SystemUser from '@/system/models/SystemUser';
import TenantUser from '@/models/TenantUser';
// import TenantModel from '@/models/TenantModel';

// const TenantWebsite: {
//   tenantDb: Knex,
//   tenantId: Number,
//   tenantOrganizationId: String,
// }

@Service()
export default class TenantsManager {

  constructor() {
    this.knexCache = new Map();
  }

  async getTenant(organizationId) {
    const tenant = await Tenant.query()
      .where('organization_id', organizationId).first();

    return tenant;
  }

  /**
   * Creates a new tenant database.
   * @param {Integer} uniqId 
   * @return {TenantWebsite}
   */
  async createTenant(uniqId) {
    const organizationId = uniqId || uniqid();
    const tenantOrganization = await Tenant.query().insert({
      organization_id: organizationId,
    });

    const tenantDbName = `bigcapital_tenant_${organizationId}`;
    await dbManager.createDb(tenantDbName);

    const tenantDb = TenantsManager.knexInstance(organizationId);
    await tenantDb.migrate.latest();
    
    return {
      tenantDb,
      tenantId: tenantOrganization.id,
      organizationId,
    };
  }

  /**
   * Drop tenant database of the given tenant website.
   * @param {TenantWebsite} tenantWebsite 
   */
  async dropTenant(tenantWebsite) {
    const tenantDbName = `bigcapital_tenant_${tenantWebsite.organizationId}`;
    await dbManager.dropDb(tenantDbName);

    await SystemUser.query()
      .where('tenant_id', tenantWebsite.tenantId);
  }

  /**
   * Creates a user that associate to the given tenant.
   */
  async createTenantUser(tenantWebsite, user) {
    const userInsert = { ...user };

    const systemUser = await SystemUser.query().insert({
      ...user,
      tenant_id: tenantWebsite.tenantId,
    });
    TenantModel.knexBinded = tenantWebsite.tenantDb;

    const tenantUser = await TenantUser.bindKnex(tenantWebsite.tenantDb)
      .query()
      .insert({
        ...omit(userInsert, ['password']),
      });
    return {
      ...tenantUser,
      ...systemUser
    };
  }

  /**
   * Retrieve all tenants metadata from system storage.
   */
  getAllTenants() {
    return Tenant.query();
  }

  /**
   * Retrieve the given organization id knex configuration.
   * @param {String} organizationId -
   */
  getTenantKnexConfig(organizationId) {
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
      pool: { min: 0, max: 5 },
    };
  }

  knexInstance(organizationId) {
    const knexCache = new Map();
    let knex = knexCache.get(organizationId);

    if (!knex) {
      knex = Knex({
        ...this.getTenantKnexConfig(organizationId),
        ...knexSnakeCaseMappers({ upperCase: true }),
      });
      knexCache.set(organizationId, knex);
    }
    return knex;
  }
}