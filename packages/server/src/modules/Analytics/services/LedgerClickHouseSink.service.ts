import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ClsService } from 'nestjs-cls';
import {
  ILedgerDelta,
  ILedgerAnalyticsSyncJobPayload,
  LedgerAnalyticsSyncQueue,
} from '../Analytics.constants';
import { ILedger } from '../../Ledger/types/Ledger.types';
import { LedgerAnalyticsDirtySet } from './LedgerAnalyticsDirtySet.service';

@Injectable()
export class LedgerClickHouseSink {
  constructor(
    @InjectQueue(LedgerAnalyticsSyncQueue)
    private readonly syncQueue: Queue,
    private readonly dirtySet: LedgerAnalyticsDirtySet,
    private readonly cls: ClsService,
  ) {}

  /**
   * Queues the ledger deltas of a committed ledger to the analytics store.
   * @param {ILedger} ledger
   */
  public onLedgerCommitted(ledger: ILedger): void {
    const organizationId = this.cls.get<string>('organizationId');
    if (!organizationId) return;

    const deltas: ILedgerDelta[] = ledger
      .getEntries()
      .filter(
        (entry) => Boolean(entry.credit || entry.debit) && entry.accountId,
      )
      .map((entry) => ({
        accountId: entry.accountId,
        credit: entry.credit,
        debit: entry.debit,
      }));

    this.enqueue({
      organizationId,
      deltas,
      accountIds: this.uniqAccountIds(deltas),
    });
  }

  /**
   * Queues the negated deltas of the deleted ledger entries to
   * the analytics store.
   * @param {Array<{accountId: number; credit: number; debit: number}>} deletedEntries - The deleted rows as they were read from the tenant database.
   */
  public onLedgerDeleted(
    deletedEntries: Array<{ accountId: number; credit: number; debit: number }>,
  ): void {
    const organizationId = this.cls.get<string>('organizationId');
    if (!organizationId) return;

    const deltas: ILedgerDelta[] = deletedEntries
      .filter(
        (entry) => Boolean(entry.credit || entry.debit) && entry.accountId,
      )
      .map((entry) => ({
        accountId: entry.accountId,
        credit: entry.credit ? -entry.credit : 0,
        debit: entry.debit ? -entry.debit : 0,
      }));

    this.enqueue({
      organizationId,
      deltas,
      accountIds: this.uniqAccountIds(deltas),
    });
  }

  /**
   * Enqueues the sync job, marking the organization as dirty on failure
   * so the reconcile job will rebuild its data later.
   * @param {ILedgerAnalyticsSyncJobPayload} payload
   */
  private enqueue(payload: ILedgerAnalyticsSyncJobPayload): void {
    if (payload.deltas.length === 0) return;

    this.syncQueue
      .add('sync-ledger', payload, {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
      })
      .catch(() => {
        // Mark the organization as dirty to reconcile it later.
        this.dirtySet.mark(payload.organizationId);
      });
  }

  /**
   * Retrieves unique account ids of the given deltas.
   * @param {ILedgerDelta[]} deltas
   * @returns {number[]}
   */
  private uniqAccountIds(deltas: ILedgerDelta[]): number[] {
    return Array.from(new Set(deltas.map((d) => d.accountId)));
  }
}
