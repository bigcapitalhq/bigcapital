import knex, { Knex } from 'knex';
import Client_MySQL2 = require('knex/lib/dialects/mysql2');
import { UnitOfWork } from './UnitOfWork.service';
import { runAfterTransaction } from './TransactionsHooks';

interface HeldQuery {
  promise: Promise<void>;
  release: () => void;
  fail: (error: Error) => void;
}

/**
 * A real knex instance over a fake MySQL driver. Every query succeeds at
 * once, except those the test holds: they finish when the test releases or
 * fails them.
 */
const createFakeDatabase = () => {
  const queries: string[] = [];
  const held = new Map<string, HeldQuery>();

  const hold = (sqlPrefix: string): HeldQuery => {
    let release: () => void;
    let fail: (error: Error) => void;
    const promise = new Promise<void>((resolve, reject) => {
      release = resolve;
      fail = reject;
    });
    const query = { promise, release, fail };
    held.set(sqlPrefix, query);
    return query;
  };
  const createConnection = () => ({
    stream: { destroyed: false },
    on: () => undefined,
    removeAllListeners: () => undefined,
    connect: (callback) => callback(null),
    end: (callback) => callback?.(),
    query: (options, bindings, callback) => {
      queries.push(options.sql);
      const prefix = [...held.keys()].find((p) => options.sql.startsWith(p));
      const finished = prefix ? held.get(prefix).promise : Promise.resolve();

      finished.then(
        () => {
          queries.push(`done ${options.sql}`);
          callback(null, [], []);
        },
        (error) => callback(error),
      );
    },
  });
  class FakeMySqlClient extends Client_MySQL2 {
    _driver() {
      return { createConnection };
    }
  }
  const db = knex({
    client: FakeMySqlClient as unknown as Knex.Config['client'],
    connection: {},
    pool: { min: 0, max: 2 },
  });
  // Lets every held query finish, so a failed test doesn't block the pool.
  const releaseAll = () => held.forEach((query) => query.release());

  return { db, queries, hold, releaseAll };
};

/** Lets pending knex callbacks run. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 20));

/** Records a promise's outcome without awaiting it. */
const track = <T>(promise: Promise<T>) => {
  const state: { status: string; value?: T; error?: unknown } = {
    status: 'pending',
  };
  promise.then(
    (value) => Object.assign(state, { status: 'resolved', value }),
    (error) => Object.assign(state, { status: 'rejected', error }),
  );
  return state;
};

describe('UnitOfWork.withTransaction', () => {
  let database: ReturnType<typeof createFakeDatabase>;
  let unitOfWork: UnitOfWork;

  beforeEach(() => {
    database = createFakeDatabase();
    unitOfWork = new UnitOfWork(() => database.db);
  });
  afterEach(() => {
    database.releaseAll();
    return database.db.destroy();
  });

  it('resolves with the work result only once the COMMIT has finished', async () => {
    const commit = database.hold('COMMIT');
    const result = track(unitOfWork.withTransaction(async () => 'created'));

    await settle();
    expect(result.status).toBe('pending');

    commit.release();
    await settle();
    expect(result).toEqual({ status: 'resolved', value: 'created' });
  });

  it('rejects with the database error when the COMMIT fails', async () => {
    const commit = database.hold('COMMIT');
    const result = track(unitOfWork.withTransaction(async () => 'created'));
    const commitError = new Error('Connection lost');

    await settle();
    commit.fail(commitError);
    await settle();
    expect(result.status).toBe('rejected');
    expect(result.error).toBe(commitError);
  });

  it('rejects with the work error only once the ROLLBACK has finished', async () => {
    const rollback = database.hold('ROLLBACK');
    const workError = new Error('Validation failed');
    const result = track(
      unitOfWork.withTransaction(async () => {
        throw workError;
      }),
    );

    await settle();
    expect(result.status).toBe('pending');

    rollback.release();
    await settle();
    expect(result.status).toBe('rejected');
    expect(result.error).toBe(workError);
  });

  it("runs the work in the caller's transaction, without committing or rolling back", async () => {
    const callerTrx = {} as Knex.Transaction;
    const work = jest.fn(async () => 'edited');

    await expect(unitOfWork.withTransaction(work, callerTrx)).resolves.toBe(
      'edited',
    );
    expect(work).toHaveBeenCalledWith(callerTrx);
    expect(database.queries).toEqual([]);
  });

  it('commits a work that returns a plain value', async () => {
    await expect(unitOfWork.withTransaction(() => 'plain')).resolves.toBe(
      'plain',
    );
    expect(database.queries).toContain('done COMMIT;');
  });

  it('rolls back a work that throws synchronously', async () => {
    const workError = new Error('Thrown at once');

    await expect(
      unitOfWork.withTransaction(() => {
        throw workError;
      }),
    ).rejects.toBe(workError);
    expect(database.queries).toContain('done ROLLBACK');
  });

  it('runs runAfterTransaction callbacks once, after the COMMIT', async () => {
    const commit = database.hold('COMMIT');
    const callback = jest.fn();
    const result = track(
      unitOfWork.withTransaction(async (trx) => {
        runAfterTransaction(trx, callback);
        return 'created';
      }),
    );

    await settle();
    expect(callback).not.toHaveBeenCalled();

    commit.release();
    await settle();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(result.status).toBe('resolved');
  });

  it("doesn't run runAfterTransaction callbacks when the work throws", async () => {
    const callback = jest.fn();
    const workError = new Error('Validation failed');

    await expect(
      unitOfWork.withTransaction(async (trx) => {
        runAfterTransaction(trx, callback);
        throw workError;
      }),
    ).rejects.toBe(workError);
    await settle();
    expect(callback).not.toHaveBeenCalled();
  });

  it('rejects when the work rejects without an error', async () => {
    const result = track(
      unitOfWork.withTransaction(() => Promise.reject(undefined)),
    );

    await settle();
    expect(result.status).toBe('rejected');
    expect(database.queries).toContain('done ROLLBACK');
  });
});
