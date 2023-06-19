import { Inject, Service } from 'typedi';
import { ObjectId } from 'mongodb';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { SeedMigration } from '@/lib/Seeder/SeedMigration';
import { Tenant } from '@/system/models';
import { ServiceError } from '@/exceptions';
import TenantDBManager from '@/services/Tenancy/TenantDBManager';
import config from '../../config';
import { ERRORS } from './constants';
import OrganizationService from './OrganizationService';
import TenantsManagerService from '@/services/Tenancy/TenantsManager';

@Service()
export default class OrganizationUpgrade {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  organizationService: OrganizationService;

  @Inject()
  tenantsManager: TenantsManagerService;

  @Inject('agenda')
  agenda: any;

  /**
   * Upgrades the given organization database.
   * @param {number} tenantId - Tenant id.
   * @returns {Promise<void>}
   */
  public upgradeJob = async (tenantId: number): Promise<void> => {
    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    // Validate tenant version.
    this.validateTenantVersion(tenant);

    // Initialize the tenant.
    const seedContext = this.tenantsManager.getSeedMigrationContext(tenant);

    // Database manager.
    const dbManager = new TenantDBManager();

    // Migrate the organization database schema.
    await dbManager.migrate(tenant);

    // Seeds the organization database data.
    await new SeedMigration(seedContext.knex, seedContext).latest();

    // Update the organization database version.
    await this.organizationService.flagTenantDBBatch(tenantId);

    // Remove the tenant job id.
    await Tenant.markAsUpgraded(tenantId);
  };

  /**
   * Running organization upgrade job.
   * @param {number} tenantId - Tenant id.
   * @return {Promise<void>}
   */
  public upgrade = async (tenantId: number): Promise<{ jobId: string }> => {
    const tenant = await Tenant.query().findById(tenantId);

    // Validate tenant version.
    this.validateTenantVersion(tenant);

    // Validate tenant upgrade is not running.
    this.validateTenantUpgradeNotRunning(tenant);

    // Send welcome mail to the user.
    const jobMeta = await this.agenda.now('organization-upgrade', {
      tenantId,
    });
    // Transformes the mangodb id to string.
    const jobId = new ObjectId(jobMeta.attrs._id).toString();

    // Marks the tenant as currently building.
    await Tenant.markAsUpgrading(tenantId, jobId);

    return { jobId };
  };

  /**
   * Validates the given tenant version.
   * @param {ITenant} tenant
   */
  private validateTenantVersion(tenant) {
    if (tenant.databaseBatch >= config.databaseBatch) {
      throw new ServiceError(ERRORS.TENANT_DATABASE_UPGRADED);
    }
  }

  /**
   * Validates the given tenant upgrade is not running.
   * @param tenant
   */
  private validateTenantUpgradeNotRunning(tenant) {
    if (tenant.isUpgradeRunning) {
      throw new ServiceError(ERRORS.TENANT_UPGRADE_IS_RUNNING);
    }
  }
}