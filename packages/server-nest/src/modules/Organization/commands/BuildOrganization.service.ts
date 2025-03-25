import {
  IOrganizationBuildDTO,
  IOrganizationBuildEventPayload,
  IOrganizationBuiltEventPayload,
} from '../Organization.types';
import { Injectable } from '@nestjs/common';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { throwIfTenantInitizalized, throwIfTenantIsBuilding } from '../Organization/_utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TenantsManagerService } from '@/modules/TenantDBManager/TenantsManager';
import { events } from '@/common/events/events';
import { transformBuildDto } from '../Organization.utils';
import { BuildOrganizationDto } from '../dtos/Organization.dto';

@Injectable()
export class BuildOrganizationService {
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly tenantsManager: TenantsManagerService,
    private readonly tenancyContext: TenancyContext
  ) {}

  /**
   * Builds the database schema and seed data of the given organization id.
   * @param {srting} organizationId
   * @return {Promise<void>}
   */
  public async build(
    buildDTO: BuildOrganizationDto,
  ): Promise<void> {
    const tenant = await this.tenancyContext.getTenant();
    const systemUser = await this.tenancyContext.getSystemUser();

    // Throw error if the tenant is already initialized.
    throwIfTenantInitizalized(tenant);

    // Drop the database if is already exists.
    await this.tenantsManager.dropDatabaseIfExists(tenant);

    // Creates a new database.
    await this.tenantsManager.createDatabase(tenant);

    // Migrate the tenant.
    await this.tenantsManager.migrateTenant(tenant);

    // Migrated tenant.
    const migratedTenant = await tenant.$query().withGraphFetched('metadata');

    // Creates a tenancy object from given tenant model.
    const tenancyContext =
      this.tenantsManager.getSeedMigrationContext(migratedTenant);

    // Seed tenant.
    await this.tenantsManager.seedTenant(migratedTenant, tenancyContext);

    // Throws `onOrganizationBuild` event.
    await this.eventPublisher.emitAsync(events.organization.build, {
      tenantId: tenant.id,
      buildDTO,
      systemUser,
    } as IOrganizationBuildEventPayload);

    // Markes the tenant as completed builing.
    await Tenant.markAsBuilt(tenantId);
    await Tenant.markAsBuildCompleted(tenantId);

    //
    await this.flagTenantDBBatch(tenantId);

    // Triggers the organization built event.
    await this.eventPublisher.emitAsync(events.organization.built, {
      tenantId: tenant.id,
    } as IOrganizationBuiltEventPayload);
  }

  /**
   *
   * @param {number} tenantId
   * @param {IOrganizationBuildDTO} buildDTO
   * @returns
   */
  async buildRunJob(
    buildDTO: BuildOrganizationDto,
  ) {
    const tenant = await this.tenancyContext.getTenant();
    const systemUser = await this.tenancyContext.getSystemUser();

    // Throw error if the tenant is already initialized.
    throwIfTenantInitizalized(tenant);

    // Throw error if tenant is currently building.
    throwIfTenantIsBuilding(tenant);

    // Transformes build DTO object.
    const transformedBuildDTO = transformBuildDto(buildDTO);

    // Saves the tenant metadata.
    await tenant.saveMetadata(transformedBuildDTO);

    // Send welcome mail to the user.
    const jobMeta = await this.agenda.now('organization-setup', {
      tenantId,
      buildDTO,
      authorizedUser,
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
  public async revertBuildRunJob() {
    // await Tenant.markAsBuildCompleted(tenantId, jobId);
  }
  /**
   * Adds organization database latest batch number.
   * @param {number} tenantId
   * @param {number} version
   */
  public async flagTenantDBBatch(tenantId: number) {
    await Tenant.query()
      .update({
        databaseBatch: config.databaseBatch,
      })
      .where({ id: tenantId });
  }
}
