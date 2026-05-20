import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import {
  BuildOrganizationResult,
  IOrganizationBuildEventPayload,
  IOrganizationBuiltEventPayload,
  OrganizationBuildQueue,
  OrganizationBuildQueueJob,
  OrganizationBuildQueueJobPayload,
} from '../Organization.types';
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
import { TenantModel } from '@/modules/System/models/TenantModel';
import { SystemUser } from '@/modules/System/models/SystemUser';

@Injectable()
export class BuildOrganizationService {
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly tenantsManager: TenantsManagerService,
    private readonly tenancyContext: TenancyContext,
    private readonly tenantRepository: TenantRepository,
    private readonly clsService: ClsService,

    @InjectQueue(OrganizationBuildQueue)
    private readonly organizationBuildQueue: Queue,

    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,
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
    await this.tenantsManager.seedTenant();

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
   * Execute the tenant database build process.
   * @param {BuildOrganizationDto} buildDTO - Organization build dto.
   * @returns {Promise<{ nextRunAt: Date; jobId: string }>} - Returns the next run date and job id.
   */
  async buildRunJob(
    buildDTO: BuildOrganizationDto,
  ): Promise<BuildOrganizationResult> {
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

    return {
      delay: jobMeta.delay,
      processedOn: jobMeta.processedOn,
      jobId: jobMeta.id,
    };
  }

  /**
   * Marks the tenant as building.
   * @param {string} buildJobId - The build job id.
   */
  public async markAsBuilding(buildJobId: string) {
    const tenant = await this.tenancyContext.getTenant();
    await this.tenantRepository.markAsBuilding(buildJobId).findById(tenant.id);
  }

  /**
   * Unlocks tenant build run job.
   */
  public async revertBuildRunJob() {
    const tenant = await this.tenancyContext.getTenant();

    await this.tenantRepository.markAsBuildCompleted().findById(tenant.id);
  }

  /**
   * Builds the database schema and seed data for a specific tenant and user.
   * This is used for workspace creation where the tenant is not the current context tenant.
   * @param {number} tenantId - The tenant id to build.
   * @param {number} userId - The user id to use for the build.
   * @param {BuildOrganizationDto} buildDTO - Organization build dto.
   * @return {Promise<void>}
   */
  public async buildForTenant(
    tenantId: number,
    userId: number,
    buildDTO: BuildOrganizationDto,
  ): Promise<void> {
    const tenant = await this.tenantModel.query().findById(tenantId);
    const systemUser = await this.systemUserModel.query().findById(userId);

    if (!tenant) {
      throw new Error('Tenant not found');
    }
    if (!systemUser) {
      throw new Error('System user not found');
    }

    // Throw error if the tenant is already initialized.
    throwIfTenantInitizalized(tenant);

    // Set the tenant context for this build operation.
    this.clsService.set('organizationId', tenant.organizationId);
    this.clsService.set('userId', userId);

    await this.tenantsManager.dropDatabaseIfExists();
    await this.tenantsManager.createDatabase();

    await this.tenantsManager.migrateTenant();
    await this.tenantsManager.seedTenant();

    // Throws `onOrganizationBuild` event.
    await this.eventPublisher.emitAsync(events.organization.build, {
      tenantId: tenant.id,
      buildDTO,
      systemUser,
    } as IOrganizationBuildEventPayload);

    // Marks the tenant as completed building.
    await this.tenantRepository.markAsBuilt().findById(tenant.id);
    await this.tenantRepository.markAsBuildCompleted().findById(tenant.id);

    // Flags the tenant database batch.
    await this.tenantRepository.flagTenantDBBatch().findById(tenant.id);

    // Triggers the organization built event.
    await this.eventPublisher.emitAsync(events.organization.built, {
      tenantId: tenant.id,
    } as IOrganizationBuiltEventPayload);
  }
}
