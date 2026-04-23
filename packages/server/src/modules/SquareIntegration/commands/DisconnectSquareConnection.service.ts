import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SquareConnection } from '../models/SquareConnection.model';

@Injectable()
export class DisconnectSquareConnection {
  constructor(
    @Inject(SquareConnection.name)
    private readonly connectionModel: TenantModelProxy<typeof SquareConnection>,
  ) {}

  /**
   * Mark the connection as disabled. Does NOT delete historical Sale
   * Receipts, Invoices, Expenses, etc. that were created from this
   * connection — those are real accounting records. Also clears tokens
   * so stale credentials aren't kept around.
   */
  public async disconnect(connectionId: number) {
    return this.connectionModel()
      .query()
      .patchAndFetchById(connectionId, {
        status: 'disabled',
        accessTokenEncrypted: null,
        refreshTokenEncrypted: null,
        tokenExpiresAt: null,
        disconnectedAt: new Date(),
      });
  }
}
