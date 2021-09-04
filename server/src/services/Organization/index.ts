import { Service, Inject } from 'typedi';
import { ObjectId } from 'mongodb';
import { ServiceError } from 'exceptions';
import {
  IOrganizationBuildDTO,
  IOrganizationUpdateDTO,
  ITenant,
} from 'interfaces';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import events from 'subscribers/events';
import TenantsManager from 'services/Tenancy/TenantsManager';
import { Tenant } from 'system/models';

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
    await this.tenantsManager.migrateTenant(tenant);

    // Migrated tenant.
    const migratedTenant = await tenant.$query();

    // Seed tenant.
    await this.tenantsManager.seedTenant(migratedTenant);

    // Markes the tenant as completed builing.
    await Tenant.markAsBuilt(tenantId);
    await Tenant.markAsBuildCompleted(tenantId);

    // Throws `onOrganizationBuild` event.
    this.eventDispatcher.dispatch(events.organization.build, {
      tenantId: tenant.id,
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
    await tenant.saveMetadata(buildDTO);

    // Send welcome mail to the user.
    const jobMeta = await this.agenda.now('organization-setup', {
      tenantId,
      buildDTO,
    });
    // Transformes the mangodb id to string.
    const jobId = new ObjectId(jobMeta.attrs._id).toString();

    // Markes the tenant as currently building.
    await Tenant.markAsBuilding(tenantId, jobId);

    return {
      nextRunAt: jobMeta.attrs.nextRunAt,
      jobId: jobMeta.attrs._id,
    };
  }

  /**
   * Unlocks tenant build run job.
   * @param {number} tenantId
   * @param {number} jobId
   */
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
   * Updates organization information.
   * @param {ITenant} tenantId
   * @param {IOrganizationUpdateDTO} organizationDTO
   */
  public async updateOrganization(
    tenantId: number,
    organizationDTO: IOrganizationUpdateDTO
  ): Promise<void> {
    const tenant = await Tenant.query().findById(tenantId);

    // Throw error if the tenant not exists.
    this.throwIfTenantNotExists(tenant);

    await tenant.saveMetadata(organizationDTO);
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
   * Throw error if the tenant is building.
   * @param {ITenant} tenant
   */
  private throwIfTenantIsBuilding(tenant) {
    if (tenant.buildJobId) {
      throw new ServiceError(ERRORS.TENANT_IS_BUILDING);
    }
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
