import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import {
  IOrganizationBuildEventPayload,
  IOrganizationBuiltEventPayload,
  OrganizationBuildQueue,
  OrganizationBuildQueueJob,
  OrganizationBuildQueueJobPayload,
} from '../Organization.types';
import { Injectable } from '@nestjs/common';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import {
  throwIfTenantInitizalized,
  throwIfTenantIsBuilding,
} from '../Organization/_utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TenantsManagerService } from '@/modules/TenantDBManager/TenantsManager';
import { events } from '@/common/events/events';
import { transformBuildDto } from '../Organization.utils';
import { BuildOrganizationDto } from '../dtos/Organization.dto';
import { TenantRepository } from '@/modules/System/repositories/Tenant.repository';

@Injectable()
export class BuildOrganizationService {
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly tenantsManager: TenantsManagerService,
    private readonly tenancyContext: TenancyContext,
    private readonly tenantRepository: TenantRepository,

    @InjectQueue(OrganizationBuildQueue)
    private readonly organizationBuildQueue: Queue,
  ) {}

  /**
   * Builds the database schema and seed data of the given organization id.
   * @param {string} organizationId
   * @return {Promise<void>}
   */
  public async build(buildDTO: BuildOrganizationDto): Promise<void> {
    const tenant = await this.tenancyContext.getTenant();
    const systemUser = await this.tenancyContext.getSystemUser();

    // Throw error if the tenant is already initialized.
    throwIfTenantInitizalized(tenant);

    await this.tenantsManager.dropDatabaseIfExists();
    await this.tenantsManager.createDatabase();
    await this.tenantsManager.migrateTenant();

    // Migrated tenant.
    const migratedTenant = await tenant.$query().withGraphFetched('metadata');

    // Creates a tenancy object from given tenant model.
    // const tenancyContext =
    //   this.tenantsManager.getSeedMigrationContext(migratedTenant);

    // Seed tenant.
    // await this.tenantsManager.seedTenant(migratedTenant, {});

    // Throws `onOrganizationBuild` event.
    await this.eventPublisher.emitAsync(events.organization.build, {
      tenantId: tenant.id,
      buildDTO,
      systemUser,
    } as IOrganizationBuildEventPayload);

    // Marks the tenant as completed builing.
    await this.tenantRepository.markAsBuilt().findById(tenant.id);
    await this.tenantRepository.markAsBuildCompleted().findById(tenant.id);

    // Flags the tenant database batch.
    await this.tenantRepository.flagTenantDBBatch().findById(tenant.id);

    // Triggers the organization built event.
    await this.eventPublisher.emitAsync(events.organization.built, {
      tenantId: tenant.id,
    } as IOrganizationBuiltEventPayload);
  }

  /**
   *
   * @param {BuildOrganizationDto} buildDTO
   * @returns {Promise<{ nextRunAt: Date; jobId: string }>} - Returns the next run date and job id.
   */
  async buildRunJob(
    buildDTO: BuildOrganizationDto,
  ): Promise<{ nextRunAt: Date; jobId: string }> {
    const tenant = await this.tenancyContext.getTenant();
    const systemUser = await this.tenancyContext.getSystemUser();

    // Throw error if the tenant is already initialized.
    throwIfTenantInitizalized(tenant);

    // Throw error if tenant is currently building.
    throwIfTenantIsBuilding(tenant);

    // Transforms build DTO object.
    const transformedBuildDTO = transformBuildDto(buildDTO);

    // Saves the tenant metadata.
    await this.tenantRepository.saveMetadata(tenant.id, transformedBuildDTO);

    // Run the organization database build job.
    const jobMeta = await this.organizationBuildQueue.add(
      OrganizationBuildQueueJob,
      {
        organizationId: tenant.organizationId,
        userId: systemUser.id,
        buildDto: transformedBuildDTO,
      } as OrganizationBuildQueueJobPayload,
    );
    // Marks the tenant as currently building.
    await this.tenantRepository.markAsBuilding(jobMeta.id).findById(tenant.id);

    return {
      nextRunAt: jobMeta.data.nextRunAt,
      jobId: jobMeta.data.id,
    };
  }

  /**
   * Unlocks tenant build run job.
   * @param {number} tenantId
   * @param {number} jobId
   */
  public async revertBuildRunJob() {
    const tenant = await this.tenancyContext.getTenant();

    await this.tenantRepository.markAsBuildCompleted().findById(tenant.id);
  }
}
