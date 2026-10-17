import { UnitOfWork } from './UnitOfWork.service';
import { PublishExpense } from '@/modules/Expenses/commands/PublishExpense.service';

const knex = require('knex');

jest.mock('@/modules/Expenses/models/Expense.model', () => ({
  Expense: class Expense {},
}));
jest.mock(
  '@/modules/Expenses/commands/CommandExpenseValidator.service',
  () => ({
    CommandExpenseValidator: class CommandExpenseValidator {},
  }),
);
jest.mock('@/common/events/events', () => ({
  events: {
    expenses: { onPublishing: 'publishing', onPublished: 'published' },
  },
}));
jest.mock(
  '@nestjs/event-emitter',
  () => ({ EventEmitter2: class EventEmitter2 {} }),
  { virtual: true },
);

function deferred() {
  let resolve: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve: () => resolve() };
}

class ControlledClient extends knex.Client {
  async acquireConnection() {
    return {};
  }
  async releaseConnection() {}
  async _query(_connection, query) {
    const control = this.config.control;
    control.queries.push(query.sql);
    if (query.sql === 'COMMIT;') {
      control.commitStarted.resolve();
      await control.commitGate.promise;
      if (control.commitError) throw control.commitError;
    }
    if (query.sql === 'ROLLBACK') {
      control.rollbackStarted.resolve();
      await control.rollbackGate.promise;
    }
    return query;
  }
}

describe('transaction completion at the command boundary', () => {
  let db: any;
  let control: any;
  let uow: UnitOfWork;
  let command: PublishExpense;

  beforeEach(() => {
    control = {
      commitStarted: deferred(),
      rollbackStarted: deferred(),
      commitGate: deferred(),
      rollbackGate: deferred(),
      queries: [],
    };
    db = knex({ client: ControlledClient, control });
    uow = new UnitOfWork(() => db);
    const query: any = {
      findById: () => query,
      forUpdate: () => query,
      throwIfNotFound: async () => ({}),
      modify: async () => ({}),
      withGraphFetched: async () => ({}),
    };
    command = new PublishExpense(
      { emitAsync: jest.fn() } as any,
      { validateExpenseIsNotPublished: jest.fn() } as any,
      uow,
      (() => ({
        query: (trx) => {
          trx.executionPromise.catch(() => {});
          return query;
        },
      })) as any,
    );
  });

  afterEach(async () => {
    control.commitGate.resolve();
    control.rollbackGate.resolve();
    await db.destroy();
  });

  it('keeps the financial command pending until its commit finishes', async () => {
    let settled = false;
    const operation = command.publishExpense(7);
    operation.then(() => {
      settled = true;
    });
    await control.commitStarted.promise;
    await new Promise(setImmediate);
    const settledBeforeCommit = settled;
    control.commitGate.resolve();
    await operation;
    expect(settledBeforeCommit).toBe(false);
  });

  it('reports a SQL commit failure to the financial command caller', async () => {
    control.commitError = new Error('fabricated commit failure');
    control.commitGate.resolve();
    await expect(command.publishExpense(7)).rejects.toThrow(
      control.commitError,
    );
  });

  it('waits for rollback before returning the work failure', async () => {
    const error = new Error('fabricated work failure');
    let settled = false;
    const operation = uow.withTransaction(() => {
      throw error;
    });
    operation.catch(() => {
      settled = true;
    });
    await control.rollbackStarted.promise;
    await new Promise(setImmediate);
    const settledBeforeRollback = settled;
    control.rollbackGate.resolve();
    await expect(operation).rejects.toBe(error);
    expect(settledBeforeRollback).toBe(false);
  });

  it('commits synchronous work before returning its result', async () => {
    control.commitGate.resolve();
    await expect(uow.withTransaction(() => 'posted')).resolves.toBe('posted');
    expect(control.queries).toContain('COMMIT;');
  });

  it('leaves a supplied transaction open after successful work', async () => {
    const trx = await db.transaction();
    await expect(uow.withTransaction(() => 'posted', trx)).resolves.toBe(
      'posted',
    );
    expect(trx.isCompleted()).toBe(false);
    control.rollbackGate.resolve();
    await trx.rollback();
  });

  it('leaves a supplied transaction open after failed work', async () => {
    const trx = await db.transaction();
    const error = new Error('fabricated work failure');
    await expect(
      uow.withTransaction(() => {
        throw error;
      }, trx),
    ).rejects.toBe(error);
    expect(trx.isCompleted()).toBe(false);
    control.rollbackGate.resolve();
    await trx.rollback();
  });
});
