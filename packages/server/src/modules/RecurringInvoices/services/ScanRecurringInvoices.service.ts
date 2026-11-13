import { Inject, Injectable, Logger } from '@nestjs/common';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { UserTenant } from '@/modules/System/models/UserTenant.model';
import { RecurringInvoicesQueue } from './RecurringInvoicesQueue.service';

@Injectable()
export class ScanRecurringInvoices {
  private readonly logger = new Logger(ScanRecurringInvoices.name);

  constructor(
    private readonly recurringInvoicesQueue: RecurringInvoicesQueue,

    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,

    @Inject(UserTenant.name)
    private readonly userTenantModel: typeof UserTenant,
  ) {}

  /**
   * Enqueues a processing job for every initialized, active tenant.
   */
  public async scan(): Promise<void> {
    const tenants = await this.tenantModel
      .query()
      .whereNotNull('initializedAt')
      .whereNotNull('seededAt')
      .where((builder) => {
        builder.where('isInactive', false).orWhereNull('isInactive');
      })
      .where((builder) => {
        builder.where('isDeleting', false).orWhereNull('isDeleting');
      });

    for (const tenant of tenants) {
      const user = await this.findTenantUser(tenant.id);

      if (!user) {
        this.logger.warn(
          `Skipping recurring invoices scan for tenant ${tenant.organizationId}: no active user.`,
        );
        continue;
      }

      await this.recurringInvoicesQueue.enqueueTenant({
        organizationId: tenant.organizationId,
        userId: user.id,
      });
    }
  }

  /**
   * Finds an active user for the tenant, preferring the workspace owner.
   * Falls back to the legacy `users.tenant_id` link for older tenants.
   */
  private async findTenantUser(tenantId: number): Promise<SystemUser | null> {
    const membership = await this.userTenantModel
      .query()
      .where('tenantId', tenantId)
      .orderByRaw("CASE WHEN role = 'owner' THEN 0 ELSE 1 END")
      .first();

    if (membership) {
      const user = await this.systemUserModel
        .query()
        .findById(membership.userId)
        .modify('active');

      if (user) {
        return user;
      }
    }

    return this.systemUserModel
      .query()
      .where('tenantId', tenantId)
      .modify('active')
      .orderBy('id', 'ASC')
      .first();
  }
}
