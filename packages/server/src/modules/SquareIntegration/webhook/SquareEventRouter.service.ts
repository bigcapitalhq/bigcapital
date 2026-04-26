import { Inject, Injectable, Logger } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SquareEventLog } from '../models/SquareEventLog.model';
import { SquareConnection } from '../models/SquareConnection.model';
import {
  HandleSquarePayment,
  HandleSquarePaymentResult,
} from '../commands/HandleSquarePayment.service';

/**
 * Phase-2 router. Logs + dedups inbound Square events (Phase-1
 * behaviour) and dispatches to a per-event-type handler (Phase-2). Event
 * types we don't have a handler for yet are marked done with a "skipped"
 * status_message so the event-log UI shows them unambiguously.
 */
@Injectable()
export class SquareEventRouter {
  private readonly logger = new Logger(SquareEventRouter.name);

  constructor(
    private readonly handlePayment: HandleSquarePayment,

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
   * Dispatch an event-log row to its handler. Marks the row done /
   * skipped / errored. Connection is passed in by the controller (it
   * already loaded it for HMAC verification + tenant routing) so the
   * router does not need its own tenant model proxy.
   */
  public async dispatch(
    entryId: number,
    connection: SquareConnection,
  ): Promise<void> {
    const entry = await this.eventLogModel().query().findById(entryId);
    if (!entry) return;

    let payload: any = {};
    try {
      payload =
        typeof entry.payload === 'string'
          ? JSON.parse(entry.payload)
          : entry.payload ?? {};
    } catch {
      payload = {};
    }

    try {
      switch (entry.eventType) {
        case 'payment.created':
        case 'payment.updated': {
          const payment = payload?.data?.object?.payment;
          const result = await this.handlePayment.handle({
            connection,
            payment,
            eventLogId: entry.id,
          });
          await this.markResult(entry.id, result);
          return;
        }

        // Phase-3 handlers land here:
        // case 'refund.created': case 'refund.updated': ...
        // case 'payout.sent':    case 'payout.paid': case 'payout.failed': ...
        // case 'customer.created': case 'customer.updated': ...

        default:
          await this.eventLogModel()
            .query()
            .findById(entry.id)
            .patch({
              status: 'done',
              processedAt: new Date(),
              errorText: `No handler for event type "${entry.eventType}" yet (Phase 2+).`,
            });
      }
    } catch (err: any) {
      this.logger.error(
        `Square handler failed for entry ${entry.id} (${entry.eventType}): ${
          err?.message ?? err
        }`,
        err?.stack,
      );
      await this.eventLogModel()
        .query()
        .findById(entry.id)
        .patch({
          status: 'failed',
          processedAt: new Date(),
          errorText: this.truncate(err?.message ?? String(err), 1024),
        });
    }
  }

  private async markResult(
    entryId: number,
    result: HandleSquarePaymentResult,
  ): Promise<void> {
    // 'reason' in result is a TypeScript-recognized type guard that
    // narrows the discriminated union reliably (the boolean-discriminator
    // form of narrowing was not collapsing for inferred call sites).
    if ('reason' in result) {
      await this.eventLogModel().query().findById(entryId).patch({
        status: 'done',
        processedAt: new Date(),
        errorText: `Skipped: ${result.reason}`,
      });
      return;
    }
    const note = result.isNew
      ? `Created SaleReceipt ${result.saleReceiptId}` +
        (result.tipJournalId ? ` + tip ManualJournal ${result.tipJournalId}` : '')
      : `Already linked to SaleReceipt ${result.saleReceiptId} (duplicate event)`;
    await this.eventLogModel().query().findById(entryId).patch({
      status: 'done',
      processedAt: new Date(),
      errorText: note,
    });
  }

  private truncate(s: string, max: number): string {
    return s.length > max ? `${s.slice(0, max - 3)}...` : s;
  }
}
