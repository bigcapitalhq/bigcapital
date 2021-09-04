import { Service, Inject } from 'typedi';
import { Container } from 'typedi';
// import { ObjectId } from 'mongoose';
import { ServiceError } from 'exceptions';
import { IOrganizationBuildDTO, ISystemUser, ITenant } from 'interfaces';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import events from 'subscribers/events';
import {
  TenantAlreadyInitialized,
  TenantAlreadySeeded,
  TenantDatabaseNotBuilt,
} from 'exceptions';
import TenantsManager from 'services/Tenancy/TenantsManager';
import { Tenant, TenantMetadata } from 'system/models';
import { ObjectId } from 'mongodb';

const ERRORS = {
  TENANT_NOT_FOUND: 'tenant_not_found',
  TENANT_ALREADY_BUILT: 'TENANT_ALREADY_BUILT',
  TENANT_ALREADY_SEEDED: 'tenant_already_seeded',
  TENANT_DB_NOT_BUILT: 'tenant_db_not_built',
  TENANT_IS_BUILDING: 'TENANT_IS_BUILDING',
};

@Service()
export default class OrganizationService {
  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  @Inject('logger')
  logger: any;

  @Inject('repositories')
  sysRepositories: any;

  @Inject()
  tenantsManager: TenantsManager;

  @Inject('agenda')
  agenda: any;

  /**
   * Builds the database schema and seed data of the given organization id.
   * @param  {srting} organizationId
   * @return {Promise<void>}
   */
  public async build(tenantId: number): Promise<void> {
    const tenant = await this.getTenantOrThrowError(tenantId);

    // Throw error if the tenant is already initialized.
    this.throwIfTenantInitizalized(tenant);

    // Drop the database if is already exists.
    await this.tenantsManager.dropDatabaseIfExists(tenant);

    // Creates a new database.
    await this.tenantsManager.createDatabase(tenant);

    // Migrate the tenant.
    const migratedTenant = await this.tenantsManager.migrateTenant(tenant);

    // Seed tenant.
    const seededTenant = await this.tenantsManager.seedTenant(migratedTenant);

    // Markes the tenant as completed builing.
    await Tenant.markAsBuilt(tenantId);
    await Tenant.markAsBuildCompleted(tenantId);

    // Throws `onOrganizationBuild` event.
    this.eventDispatcher.dispatch(events.organization.build, {
      tenant: seededTenant,
    });
  }

  /**
   *
   * @param tenantId
   * @param buildDTO
   * @returns
   */
  async buildRunJob(tenantId: number, buildDTO: IOrganizationBuildDTO) {
    const tenant = await this.getTenantOrThrowError(tenantId);

    // Throw error if the tenant is already initialized.
    this.throwIfTenantInitizalized(tenant);

    // Throw error if tenant is currently building.
    this.throwIfTenantIsBuilding(tenant);

    // Saves the tenant metadata.
    await this.saveTenantMetadata(tenant, buildDTO);

    // Send welcome mail to the user.
    const jobMeta = await this.agenda.now('organization-setup', {
      tenantId,
      buildDTO,
    });
    const jobId = new ObjectId(jobMeta.attrs._id).toString();

    // Markes the tenant as currently building.
    await Tenant.markAsBuilding(tenantId, jobId);

    return {
      nextRunAt: jobMeta.attrs.nextRunAt,
      jobId: jobMeta.attrs._id,
    };
  }

  throwIfTenantIsBuilding(tenant) {
    if (tenant.buildJobId) {
      throw new ServiceError(ERRORS.TENANT_IS_BUILDING);
    }
  }

  public async revertBuildRunJob(tenantId: number, jobId: string) {
    await Tenant.markAsBuildCompleted(tenantId, jobId);
  }

  /**
   * Retrieve the current organization metadata.
   * @param {number} tenantId
   * @returns {Promise<ITenant[]>}
   */
  public async currentOrganization(tenantId: number): Promise<ITenant> {
    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('subscriptions')
      .withGraphFetched('metadata');

    this.throwIfTenantNotExists(tenant);

    return tenant;
  }

  /**
   * Throws error in case the given tenant is undefined.
   * @param {ITenant} tenant
   */
  private throwIfTenantNotExists(tenant: ITenant) {
    if (!tenant) {
      throw new ServiceError(ERRORS.TENANT_NOT_FOUND);
    }
  }

  /**
   * Throws error in case the given tenant is already initialized.
   * @param {ITenant} tenant
   */
  private throwIfTenantInitizalized(tenant: ITenant) {
    if (tenant.builtAt) {
      throw new ServiceError(ERRORS.TENANT_ALREADY_BUILT);
    }
  }

  /**
   * Saves the organization metadata.
   * @param tenant
   * @param buildDTO
   * @returns
   */
  private saveTenantMetadata(tenant: ITenant, buildDTO) {
    return TenantMetadata.query().insert({
      tenantId: tenant.id,
      ...buildDTO,
    });
  }

  /**
   * Retrieve tenant of throw not found error.
   * @param {number} tenantId -
   */
  async getTenantOrThrowError(tenantId: number): Promise<ITenant> {
    const tenant = await Tenant.query().findById(tenantId);

    if (!tenant) {
      throw new ServiceError(ERRORS.TENANT_NOT_FOUND);
    }
    return tenant;
  }
}
