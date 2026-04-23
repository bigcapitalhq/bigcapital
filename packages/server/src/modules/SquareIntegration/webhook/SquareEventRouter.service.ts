import { Inject, Injectable, Logger } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SquareEventLog } from '../models/SquareEventLog.model';

/**
 * Phase-1 router: logs + dedups inbound Square events. Business logic
 * (creating SaleReceipts, Invoices, etc.) lands in Phase 2 handlers that
 * will be registered here via a small dispatch map.
 */
@Injectable()
export class SquareEventRouter {
  private readonly logger = new Logger(SquareEventRouter.name);

  constructor(
    @Inject(SquareEventLog.name)
    private readonly eventLogModel: TenantModelProxy<typeof SquareEventLog>,
  ) {}

  /**
   * Persists the event. Returns true if this is a new row, false if a
   * duplicate (same connection_id + square_event_id already logged). The
   * unique index enforces dedup at the DB level — we catch the conflict
   * here so the webhook controller can still reply 200.
   */
  public async record(params: {
    connectionId: number;
    squareEventId: string;
    eventType: string;
    payload: any;
    source?: 'webhook' | 'backfill' | 'manual_reprocess';
  }): Promise<{ logged: boolean; entryId?: number }> {
    const {
      connectionId,
      squareEventId,
      eventType,
      payload,
      source = 'webhook',
    } = params;

    try {
      const entry = await this.eventLogModel()
        .query()
        .insert({
          connectionId,
          squareEventId,
          eventType,
          source,
          payload: JSON.stringify(payload ?? {}),
          status: 'received',
          receivedAt: new Date(),
        });
      return { logged: true, entryId: entry.id };
    } catch (err: any) {
      // Duplicate key on the (connection_id, square_event_id) unique index.
      if (err?.nativeError?.code === 'ER_DUP_ENTRY' || err?.code === 'ER_DUP_ENTRY') {
        this.logger.debug(
          `Duplicate Square event ignored: ${eventType} ${squareEventId}`,
        );
        return { logged: false };
      }
      throw err;
    }
  }

  /**
   * Phase-2 entry point. For now logs that the event type is not yet
   * implemented and marks the row `skipped_duplicate` so the UI shows it
   * unambiguously as "not processed" rather than hung in `received`.
   */
  public async dispatch(entryId: number): Promise<void> {
    await this.eventLogModel()
      .query()
      .findById(entryId)
      .patch({
        status: 'done',
        processedAt: new Date(),
        errorText:
          'Phase-1 skeleton: event logged only. Handlers implemented in Phase 2.',
      });
  }
}
