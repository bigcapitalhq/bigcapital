import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SquareConnection } from '../models/SquareConnection.model';
import { UpdateSquareSettingsDto } from '../dtos/UpdateSquareSettings.dto';

@Injectable()
export class UpdateSquareConnectionSettings {
  constructor(
    @Inject(SquareConnection.name)
    private readonly connectionModel: TenantModelProxy<typeof SquareConnection>,
  ) {}

  /**
   * Apply wizard / settings-page updates. Only the columns present on the
   * DTO are patched. If the caller doesn't pass `status`, the row may be
   * auto-promoted to `active` once all required accounts are populated.
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
      'status',
    ];
    for (const k of keys) {
      if (dto[k] !== undefined) patch[k] = dto[k];
    }

    // Auto-promote to active when the required account picks are complete
    // and the caller hasn't explicitly set a different status.
    if (patch.status === undefined && current.status === 'pending') {
      const merged = { ...current, ...patch };
      if (
        merged.clearingAccountId &&
        merged.feesExpenseAccountId &&
        merged.tipsLiabilityAccountId &&
        merged.walkInCustomerId &&
        merged.depositBankAccountId
      ) {
        patch.status = 'active';
      }
    }

    return this.connectionModel()
      .query()
      .patchAndFetchById(connectionId, patch);
  }
}
