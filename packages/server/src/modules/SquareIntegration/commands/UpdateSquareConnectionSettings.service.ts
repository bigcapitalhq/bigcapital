import { Inject, Injectable, Logger } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { SquareConnection } from '../models/SquareConnection.model';
import { UpdateSquareSettingsDto } from '../dtos/UpdateSquareSettings.dto';
import { EnsureSquareSystemItems } from './EnsureSquareSystemItems.service';

@Injectable()
export class UpdateSquareConnectionSettings {
  private readonly logger = new Logger(UpdateSquareConnectionSettings.name);

  constructor(
    private readonly uow: UnitOfWork,
    private readonly ensureSystemItems: EnsureSquareSystemItems,

    @Inject(SquareConnection.name)
    private readonly connectionModel: TenantModelProxy<typeof SquareConnection>,
  ) {}

  /**
   * Apply wizard / settings-page updates. Only the columns present on the
   * DTO are patched. When the row first transitions to `active`, the
   * Phase-2 system items (Square Sales fallback) are auto-created so the
   * payment handler can post events without admin intervention.
   */
  public async update(connectionId: number, dto: UpdateSquareSettingsDto) {
    const current = await this.connectionModel()
      .query()
      .findById(connectionId)
      .throwIfNotFound();

    const patch: any = {};
    const keys: (keyof UpdateSquareSettingsDto)[] = [
      'clearingAccountId',
      'feesExpenseAccountId',
      'tipsLiabilityAccountId',
      'walkInCustomerId',
      'depositBankAccountId',
      'defaultSalesAccountId',
      'status',
    ];
    for (const k of keys) {
      if (dto[k] !== undefined) patch[k] = dto[k];
    }

    // Auto-promote to active when all six required selections are present
    // and the caller hasn't explicitly set a different status.
    if (patch.status === undefined && current.status === 'pending') {
      const merged = { ...current, ...patch };
      if (
        merged.clearingAccountId &&
        merged.feesExpenseAccountId &&
        merged.tipsLiabilityAccountId &&
        merged.walkInCustomerId &&
        merged.depositBankAccountId &&
        merged.defaultSalesAccountId
      ) {
        patch.status = 'active';
      }
    }

    // Patch the row, then run system-items provisioning inside the same
    // tenant transaction so a partial failure rolls back cleanly.
    return this.uow.withTransaction(async (trx) => {
      const updated = await this.connectionModel()
        .query(trx)
        .patchAndFetchById(connectionId, patch);

      const justActivated =
        current.status !== 'active' && updated.status === 'active';

      if (justActivated && !updated.squareSalesItemId) {
        try {
          await this.ensureSystemItems.ensure(updated, trx);
          // Re-read so the response reflects the new squareSalesItemId.
          return await this.connectionModel()
            .query(trx)
            .findById(connectionId)
            .throwIfNotFound();
        } catch (err: any) {
          this.logger.error(
            `Failed to auto-create Square system items for connection ${connectionId}: ${
              err?.message ?? err
            }`,
          );
          throw err;
        }
      }
      return updated;
    });
  }
}
