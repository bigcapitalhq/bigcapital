import { Transaction } from 'objection';
import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { IsolationLevel } from './TransactionsHooks';
import { TENANCY_DB_CONNECTION } from '@/modules/Tenancy/TenancyDB/TenancyDB.constants';

@Injectable()
export class UnitOfWork {
  constructor(
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKex: () => Knex,
  ) {}

  /**
   * Runs the work in a new transaction, and settles once its COMMIT or
   * ROLLBACK has finished: with the work's result, with the work's error, or
   * with the error of a COMMIT that failed. Given the caller's transaction,
   * runs the work in it, and the caller commits or rolls back.
   * @param {function} work - The work to be done in the transaction.
   * @param {Transaction} trx - The caller's transaction, if any.
   * @param {IsolationLevel} isolationLevel
   * @returns {Promise<T>}
   */
  public withTransaction = async <T>(
    work: (knex: Knex.Transaction) => Promise<T> | T,
    trx?: Transaction,
    isolationLevel: IsolationLevel = IsolationLevel.READ_UNCOMMITTED,
  ): Promise<T> => {
    if (trx) {
      return work(trx);
    }
    // knex commits when the handler resolves and rolls back when it rejects.
    // The handler is async because knex commits only a returned promise.
    // `doNotRejectOnRollback: false`: a work that rejects without an error
    // still rejects, instead of resolving once rolled back.
    return this.tenantKex().transaction(async (_trx) => work(_trx), {
      isolationLevel,
      doNotRejectOnRollback: false,
    });
  };
}
