import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserTenant } from '@/modules/System/models/UserTenant.model';
import { TenantRepository } from '@/modules/System/repositories/Tenant.repository';
import { transformBuildDto } from '@/modules/Organization/Organization.utils';
import {
  OrganizationBuildQueue,
  OrganizationBuildQueueJob,
  OrganizationBuildQueueJobPayload,
} from '@/modules/Organization/Organization.types';
import { SystemKnexConnection } from '@/modules/System/SystemDB/SystemDB.constants';
import { events } from '@/common/events/events';
import { CreateWorkspaceDto } from '../dtos/CreateWorkspace.dto';
import { CreateWorkspaceResponseDto } from '../dtos/WorkspaceResponse.dto';
import { IWorkspaceCreatedEventPayload } from '../Workspaces.types';

@Injectable()
export class CreateWorkspaceService {
  constructor(
    @Inject(UserTenant.name)
    private readonly userTenantModel: typeof UserTenant,
    @Inject(SystemKnexConnection)
    private readonly systemKnex: Knex,
    private readonly tenantRepository: TenantRepository,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue(OrganizationBuildQueue)
    private readonly organizationBuildQueue: Queue,
  ) {}

  /**
   * Creates a new workspace (organization) for the authenticated user.
   * - Creates a new tenant row with a unique organizationId (in transaction).
   * - Links the user as owner via user_tenants (in transaction).
   * - Saves organization metadata (in transaction).
   * - Enqueues the tenant database build job (outside transaction).
   */
  async createWorkspace(
    userId: number,
    dto: CreateWorkspaceDto,
  ): Promise<CreateWorkspaceResponseDto> {
    const transformedDto = transformBuildDto(dto);

    // Wrap tenant creation, user linking, and metadata save in a transaction.
    // The job enqueue happens outside the transaction since it's async.
    const tenant = await this.systemKnex.transaction(async (trx) => {
      // Create the new tenant row.
      const tenant = await this.tenantRepository.createWithUniqueOrgId(
        undefined,
        trx,
      );

      // Link the authenticated user as the owner of this new workspace.
      await this.userTenantModel.query(trx).insert({
        userId,
        tenantId: tenant.id,
        role: 'owner',
      });
      // Persist the organization metadata.
      await this.tenantRepository.saveMetadata(tenant.id, transformedDto, trx);

      return tenant;
    });
    // Emit workspace created event for subscribers to handle any post-creation setup.
    await this.eventEmitter.emitAsync(events.workspace.created, {
      tenantId: tenant.id,
      organizationId: tenant.organizationId,
      userId,
      buildDTO: transformedDto,
    } as IWorkspaceCreatedEventPayload);

    // Enqueue the organization build job for the newly created tenant.
    const jobMeta = await this.organizationBuildQueue.add(
      OrganizationBuildQueueJob,
      {
        organizationId: tenant.organizationId,
        userId,
        buildDto: transformedDto,
      } as OrganizationBuildQueueJobPayload,
    );

    return {
      organizationId: tenant.organizationId,
      jobId: jobMeta.id!,
    };
  }
}
