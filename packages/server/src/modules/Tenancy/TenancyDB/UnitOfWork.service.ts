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
   * @param {function} work - The work to be done in the transaction.
   * @param {IsolationLevel} isolationLevel
   * @returns {}
   */
  public withTransaction = async <T>(
    work: (knex: Knex.Transaction) => Promise<T> | T,
    trx?: Transaction,
    isolationLevel: IsolationLevel = IsolationLevel.READ_UNCOMMITTED,
  ): Promise<T> => {
    const knex = this.tenantKex();
    let _trx = trx;

    if (!_trx) {
      _trx = await knex.transaction({ isolationLevel });
    }
    try {
      const result = await work(_trx);

      if (!trx) {
        _trx.commit();
      }
      return result;
    } catch (error) {
      if (!trx) {
        _trx.rollback();
      }
      throw error;
    }
  };
}
