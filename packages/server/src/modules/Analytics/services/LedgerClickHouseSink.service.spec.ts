import { LedgerClickHouseSink } from './LedgerClickHouseSink.service';
import { Ledger } from '@/modules/Ledger/Ledger';
import { ILedgerAnalyticsSyncJobPayload } from '../Analytics.constants';

describe('LedgerClickHouseSink', () => {
  const makeSink = (organizationId?: string) => {
    const syncQueue = { add: jest.fn(() => Promise.resolve()) } as any;
    const dirtySet = { mark: jest.fn() } as any;
    const cls = { get: jest.fn(() => organizationId) } as any;

    const sink = new LedgerClickHouseSink(syncQueue, dirtySet, cls);
    return { sink, syncQueue, dirtySet };
  };

  const enqueuedPayload = (syncQueue: any): ILedgerAnalyticsSyncJobPayload =>
    syncQueue.add.mock.calls[0][1];

  it('queues the positive deltas of the committed ledger entries', () => {
    const { sink, syncQueue, dirtySet } = makeSink('org-1');

    const ledger = new Ledger([
      { credit: 0, debit: 100, accountId: 11 } as any,
      { credit: 40, debit: 0, accountId: 12 } as any,
      // Blank entries are excluded.
      { credit: 0, debit: 0, accountId: 13 } as any,
    ]);
    sink.onLedgerCommitted(ledger);

    expect(syncQueue.add).toHaveBeenCalledTimes(1);
    expect(enqueuedPayload(syncQueue)).toEqual({
      organizationId: 'org-1',
      deltas: [
        { accountId: 11, credit: 0, debit: 100 },
        { accountId: 12, credit: 40, debit: 0 },
      ],
      accountIds: [11, 12],
    });
    expect(dirtySet.mark).not.toHaveBeenCalled();
  });

  it('queues the negated deltas of the deleted ledger entries', () => {
    const { sink, syncQueue } = makeSink('org-1');

    sink.onLedgerDeleted([
      { accountId: 11, credit: 0, debit: 100 },
      { accountId: 12, credit: 40, debit: 0 },
      { accountId: 13, credit: 0, debit: 0 },
    ]);

    expect(enqueuedPayload(syncQueue)).toEqual({
      organizationId: 'org-1',
      deltas: [
        { accountId: 11, credit: 0, debit: -100 },
        { accountId: 12, credit: -40, debit: 0 },
      ],
      accountIds: [11, 12],
    });
  });

  it('does nothing without a tenant organization context', () => {
    const { sink, syncQueue } = makeSink(undefined);

    sink.onLedgerCommitted(
      new Ledger([{ credit: 0, debit: 100, accountId: 11 } as any]),
    );
    sink.onLedgerDeleted([{ accountId: 11, credit: 0, debit: 100 }]);

    expect(syncQueue.add).not.toHaveBeenCalled();
  });

  it('does not enqueue a job with empty deltas', () => {
    const { sink, syncQueue } = makeSink('org-1');

    sink.onLedgerCommitted(
      new Ledger([{ credit: 0, debit: 0, accountId: 11 } as any]),
    );
    sink.onLedgerDeleted([{ accountId: 11, credit: 0, debit: 0 }]);

    expect(syncQueue.add).not.toHaveBeenCalled();
  });

  it('marks the organization as dirty when enqueueing fails', async () => {
    const { sink, syncQueue, dirtySet } = makeSink('org-1');
    syncQueue.add.mockImplementationOnce(() =>
      Promise.reject(new Error('Redis is down')),
    );

    sink.onLedgerCommitted(
      new Ledger([{ credit: 0, debit: 100, accountId: 11 } as any]),
    );

    // Flush the microtasks to let the enqueue failure handler run.
    await new Promise((resolve) => setImmediate(resolve));

    expect(dirtySet.mark).toHaveBeenCalledWith('org-1');
  });
});
