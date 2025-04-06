import { Injectable } from '@nestjs/common';
import {
  ITransactionLockingMetaPOJO,
  ITransactionsLockingListPOJO,
  ITransactionsLockingSchema,
  TransactionsLockingGroup,
} from '../types/TransactionsLocking.types';
import { TRANSACTIONS_LOCKING_SCHEMA } from '../constants';
import { TransactionsLockingRepository } from '../TransactionsLockingRepository';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { TransactionsLockingMetaTransformer } from './TransactionsLockingMetaTransformer';

@Injectable()
export class QueryTransactionsLocking {
  constructor(
    private readonly transactionsLockingRepo: TransactionsLockingRepository,
    private readonly transformer: TransformerInjectable,
  ) {}

  /**
   * Retrieve transactions locking modules.
   * @returns {ITransactionLockingMetaPOJO[]}
   */
  public getTransactionsLockingModules = async (): Promise<
    ITransactionLockingMetaPOJO[]
  > => {
    const modules = TRANSACTIONS_LOCKING_SCHEMA.map(
      (schema: ITransactionsLockingSchema) =>
        this.getTransactionsLockingModuleMeta(schema.module),
    );
    return Promise.all(modules);
  };

  /**
   * Retireve the transactions locking all module.
   * @returns {ITransactionLockingMetaPOJO}
   */
  public getTransactionsLockingAll =
    (): Promise<ITransactionLockingMetaPOJO> => {
      return this.getTransactionsLockingModuleMeta(
        TransactionsLockingGroup.All,
      );
    };

  /**
   * Retrieve the transactions locking module meta.
   * @param {TransactionsLockingGroup} module -
   * @returns {ITransactionLockingMetaPOJO}
   */
  public getTransactionsLockingModuleMeta = async (
    module: TransactionsLockingGroup,
  ): Promise<ITransactionLockingMetaPOJO> => {
    const meta =
      await this.transactionsLockingRepo.getTransactionsLocking(module);

    return this.transformer.transform(
      meta,
      new TransactionsLockingMetaTransformer(),
      { module },
    );
  };

  /**
   * Retrieve transactions locking list.
   * @returns {Promise<ITransactionsLockingListPOJO>}
   */
  public getTransactionsLockingList =
    async (): Promise<ITransactionsLockingListPOJO> => {
      // Retrieve the current transactions locking type.
      const lockingType =
        await this.transactionsLockingRepo.getTransactionsLockingType();

      const all = await this.getTransactionsLockingAll();
      const modules = await this.getTransactionsLockingModules();

      return {
        lockingType,
        all,
        modules,
      };
    };
}
