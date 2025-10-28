import { sumBy, chain, keyBy } from 'lodash';
import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { TaxRateModel } from './models/TaxRate.model';
import { Inject, Injectable } from '@nestjs/common';
import { ItemEntry } from '../TransactionItemEntry/models/ItemEntry';
import { TaxRateTransaction } from './models/TaxRateTransaction.model';

@Injectable()
export class WriteTaxTransactionsItemEntries {
  constructor(
    @Inject(TaxRateTransaction.name)
    private readonly taxRateTransactionModel: TenantModelProxy<
      typeof TaxRateTransaction
    >,

    @Inject(TaxRateModel.name)
    private readonly taxRateModel: TenantModelProxy<typeof TaxRateModel>,
  ) {}

  /**
   * Writes the tax transactions from the given item entries.
   * @param {number} tenantId
   * @param {IItemEntry[]} itemEntries
   */
  public async writeTaxTransactionsFromItemEntries(
    itemEntries: ModelObject<ItemEntry>[],
    trx?: Knex.Transaction,
  ) {
    const aggregatedEntries = this.aggregateItemEntriesByTaxCode(itemEntries);
    const entriesTaxRateIds = aggregatedEntries.map((entry) => entry.taxRateId);

    const taxRates = await this.taxRateModel()
      .query(trx)
      .whereIn('id', entriesTaxRateIds);
    const taxRatesById = keyBy(taxRates, 'id');

    const taxTransactions = aggregatedEntries.map((entry) => ({
      taxRateId: entry.taxRateId,
      referenceType: entry.referenceType,
      referenceId: entry.referenceId,
      rate: entry.taxRate || (taxRatesById[entry.taxRateId]?.rate as number),
    }));
    await this.taxRateTransactionModel()
      .query(trx)
      .upsertGraph(taxTransactions as ModelObject<TaxRateTransaction>[]);
  }

  /**
   * Rewrites the tax rate transactions from the given item entries.
   * @param {number} tenantId
   * @param {IItemEntry[]} itemEntries
   * @param {string} referenceType
   * @param {number} referenceId
   * @param {Knex.Transaction} trx
   */
  public async rewriteTaxRateTransactionsFromItemEntries(
    itemEntries: ModelObject<ItemEntry>[],
    referenceType: string,
    referenceId: number,
    trx?: Knex.Transaction,
  ) {
    await Promise.all([
      this.removeTaxTransactionsFromItemEntries(
        referenceId,
        referenceType,
        trx,
      ),
      this.writeTaxTransactionsFromItemEntries(itemEntries, trx),
    ]);
  }

  /**
   * Aggregates by tax code id and sums the amount.
   * @param {IItemEntry[]} itemEntries
   * @returns {IItemEntry[]}
   */
  private aggregateItemEntriesByTaxCode = (
    itemEntries: ModelObject<ItemEntry>[],
  ): ModelObject<ItemEntry>[] => {
    return chain(itemEntries.filter((item) => item.taxRateId))
      .groupBy((item) => item.taxRateId)
      .values()
      .map((group) => ({ ...group[0], amount: sumBy(group, 'amount') }))
      .value();
  };

  /**
   * Removes the tax transactions from the given item entries.
   * @param {number} tenantId   - Tenant id.
   * @param {string} referenceType - Reference type.
   * @param {number} referenceId - Reference id.
   */
  public async removeTaxTransactionsFromItemEntries(
    referenceId: number,
    referenceType: string,
    trx?: Knex.Transaction,
  ) {
    await this.taxRateTransactionModel()
      .query(trx)
      .where({ referenceType, referenceId })
      .delete();
  }
}
