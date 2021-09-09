import { Service, Inject } from 'typedi';
import { ObjectId } from 'mongodb';
import { defaultTo } from 'lodash';
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
import OrganizationBaseCurrencyLocking from './OrganizationBaseCurrencyLocking';

const ERRORS = {
  TENANT_NOT_FOUND: 'tenant_not_found',
  TENANT_ALREADY_BUILT: 'TENANT_ALREADY_BUILT',
  TENANT_ALREADY_SEEDED: 'tenant_already_seeded',
  TENANT_DB_NOT_BUILT: 'tenant_db_not_built',
  TENANT_IS_BUILDING: 'TENANT_IS_BUILDING',
  BASE_CURRENCY_MUTATE_LOCKED: 'BASE_CURRENCY_MUTATE_LOCKED',
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

  @Inject()
  baseCurrencyMutateLocking: OrganizationBaseCurrencyLocking;

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

    // Transformes build DTO object.
    const transformedBuildDTO = this.transformBuildDTO(buildDTO);

    // Saves the tenant metadata.
    await tenant.saveMetadata(transformedBuildDTO);

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
   * Retrieve organization ability of mutate base currency
   * @param {number} tenantId
   * @returns
   */
  public mutateBaseCurrencyAbility(tenantId: number) {
    return this.baseCurrencyMutateLocking.isBaseCurrencyMutateLocked(tenantId);
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
    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    // Throw error if the tenant not exists.
    this.throwIfTenantNotExists(tenant);

    // Validate organization transactions before mutate base currency.
    await this.validateMutateBaseCurrency(
      tenant,
      organizationDTO.baseCurrency,
      tenant.metadata?.baseCurrency
    );
    await tenant.saveMetadata(organizationDTO);
  }

  /**
   * Transformes build DTO object.
   * @param {IOrganizationBuildDTO} buildDTO
   * @returns {IOrganizationBuildDTO}
   */
  private transformBuildDTO(
    buildDTO: IOrganizationBuildDTO
  ): IOrganizationBuildDTO {
    return {
      ...buildDTO,
      dateFormat: defaultTo(buildDTO.dateFormat, 'DD/MM/yyyy'),
    };
  }

  /**
   * Throw base currency mutate locked error.
   */
  private throwBaseCurrencyMutateLocked() {
    throw new ServiceError(ERRORS.BASE_CURRENCY_MUTATE_LOCKED);
  }

  /**
   * Validate mutate base currency ability.
   * @param {Tenant} tenant -
   * @param {string} newBaseCurrency -
   * @param {string} oldBaseCurrency -
   */
  private async validateMutateBaseCurrency(
    tenant: Tenant,
    newBaseCurrency: string,
    oldBaseCurrency: string
  ) {
    if (tenant.isReady && newBaseCurrency !== oldBaseCurrency) {
      const isBaseCurrencyMutateLocked =
        await this.baseCurrencyMutateLocking.isBaseCurrencyMutateLocked(
          tenant.id
        );

      if (isBaseCurrencyMutateLocked.length > 0) {
        this.throwBaseCurrencyMutateLocked();
      }
    }
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
