import { Service, Inject } from 'typedi';
import {
  ITransactionLockingMetaPOJO,
  ITransactionsLockingListPOJO,
  ITransactionsLockingSchema,
  TransactionsLockingGroup,
} from '@/interfaces';
import { TRANSACTIONS_LOCKING_SCHEMA } from './constants';
import TransactionsLockingMetaTransformer from './TransactionsLockingMetaTransformer';
import TransactionsLockingRepository from './TransactionsLockingRepository';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export default class QueryTransactionsLocking {
  @Inject()
  private transactionsLockingRepo: TransactionsLockingRepository;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve transactions locking modules.
   * @param   {number} tenantId
   * @returns {ITransactionLockingMetaPOJO[]}
   */
  public getTransactionsLockingModules = (
    tenantId: number
  ): Promise<ITransactionLockingMetaPOJO[]> => {
    const modules = TRANSACTIONS_LOCKING_SCHEMA.map(
      (schema: ITransactionsLockingSchema) =>
        this.getTransactionsLockingModuleMeta(tenantId, schema.module)
    );
    return Promise.all(modules);
  };

  /**
   * Retrieve the transactions locking all module.
   * @param   {number} tenantId
   * @returns {ITransactionLockingMetaPOJO}
   */
  public getTransactionsLockingAll = (
    tenantId: number
  ): Promise<ITransactionLockingMetaPOJO> => {
    return this.getTransactionsLockingModuleMeta(
      tenantId,
      TransactionsLockingGroup.All
    );
  };

  /**
   * Retrieve the transactions locking module meta.
   * @param   {number} tenantId -
   * @param   {TransactionsLockingGroup} module -
   * @returns {ITransactionLockingMetaPOJO}
   */
  public getTransactionsLockingModuleMeta = (
    tenantId: number,
    module: TransactionsLockingGroup
  ): Promise<ITransactionLockingMetaPOJO> => {
    const meta = this.transactionsLockingRepo.getTransactionsLocking(
      tenantId,
      module
    );
    return this.transformer.transform(
      tenantId,
      meta,
      new TransactionsLockingMetaTransformer(),
      { module }
    );
  };

  /**
   * Retrieve transactions locking list.
   * @param   {number} tenantId
   * @returns {Promise<ITransactionsLockingListPOJO>}
   */
  public getTransactionsLockingList = async (
    tenantId: number
  ): Promise<ITransactionsLockingListPOJO> => {
    // Retrieve the current transactions locking type.
    const lockingType =
      this.transactionsLockingRepo.getTransactionsLockingType(tenantId);

    const all = await this.getTransactionsLockingAll(tenantId);
    const modules = await this.getTransactionsLockingModules(tenantId);

    return {
      lockingType,
      all,
      modules,
    };
  };
}
