import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SquareConnection } from '../models/SquareConnection.model';

/**
 * Public-safe shape (no tokens). Callers rendering the settings page only
 * need metadata; the raw encrypted tokens never cross the API boundary.
 * Webhook plumbing has moved to the app-level subscription (see
 * SquareApplicationWebhook in the system DB) — no per-connection webhook
 * fields are exposed here.
 */
export interface SquareConnectionDto {
  id: number;
  merchantId: string;
  environment: string;
  status: string;
  statusMessage: string | null;
  clearingAccountId: number | null;
  feesExpenseAccountId: number | null;
  tipsLiabilityAccountId: number | null;
  walkInCustomerId: number | null;
  depositBankAccountId: number | null;
  connectedAt: Date | null;
  disconnectedAt: Date | null;
}

@Injectable()
export class GetSquareConnections {
  constructor(
    @Inject(SquareConnection.name)
    private readonly connectionModel: TenantModelProxy<typeof SquareConnection>,
  ) {}

  private toDto(row: SquareConnection): SquareConnectionDto {
    return {
      id: row.id,
      merchantId: row.merchantId,
      environment: row.environment,
      status: row.status,
      statusMessage: row.statusMessage,
      clearingAccountId: row.clearingAccountId,
      feesExpenseAccountId: row.feesExpenseAccountId,
      tipsLiabilityAccountId: row.tipsLiabilityAccountId,
      walkInCustomerId: row.walkInCustomerId,
      depositBankAccountId: row.depositBankAccountId,
      connectedAt: row.connectedAt,
      disconnectedAt: row.disconnectedAt,
    };
  }

  public async list(): Promise<SquareConnectionDto[]> {
    const rows = await this.connectionModel()
      .query()
      .orderBy('connectedAt', 'DESC');
    return rows.map((r) => this.toDto(r));
  }

  public async getById(id: number): Promise<SquareConnectionDto> {
    const row = await this.connectionModel()
      .query()
      .findById(id)
      .throwIfNotFound();
    return this.toDto(row);
  }
}
