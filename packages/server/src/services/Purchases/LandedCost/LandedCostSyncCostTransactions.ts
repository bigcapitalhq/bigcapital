import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import TransactionLandedCost from './TransactionLandedCost';
import { CONFIG } from './utils';

@Service()
export default class LandedCostSyncCostTransactions {
  @Inject()
  transactionLandedCost: TransactionLandedCost;

  /**
   * Allocate the landed cost amount to cost transactions.
   * @param {number} tenantId -
   * @param {string} transactionType
   * @param {number} transactionId
   */
  public incrementLandedCostAmount = async (
    tenantId: number,
    transactionType: string,
    transactionId: number,
    transactionEntryId: number,
    amount: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const Model = this.transactionLandedCost.getModel(
      tenantId,
      transactionType
    );
    const relation = CONFIG.COST_TYPES[transactionType].entries;

    // Increment the landed cost transaction amount.
    await Model.query(trx)
      .where('id', transactionId)
      .increment('allocatedCostAmount', amount);

    // Increment the landed cost entry.
    await Model.relatedQuery(relation, trx)
      .for(transactionId)
      .where('id', transactionEntryId)
      .increment('allocatedCostAmount', amount);
  };

  /**
   * Reverts the landed cost amount to cost transaction.
   * @param {number} tenantId - Tenant id.
   * @param {string} transactionType - Transaction type.
   * @param {number} transactionId - Transaction id.
   * @param {number} transactionEntryId - Transaction entry id.
   * @param {number} amount - Amount
   */
  public revertLandedCostAmount = async (
    tenantId: number,
    transactionType: string,
    transactionId: number,
    transactionEntryId: number,
    amount: number,
    trx?: Knex.Transaction
  ) => {
    const Model = this.transactionLandedCost.getModel(
      tenantId,
      transactionType
    );
    const relation = CONFIG.COST_TYPES[transactionType].entries;

    // Decrement the allocate cost amount of cost transaction.
    await Model.query(trx)
      .where('id', transactionId)
      .decrement('allocatedCostAmount', amount);

    // Decrement the allocated cost amount cost transaction entry.
    await Model.relatedQuery(relation, trx)
      .for(transactionId)
      .where('id', transactionEntryId)
      .decrement('allocatedCostAmount', amount);
  };
}
