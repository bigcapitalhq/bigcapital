import { sumBy, chain, keyBy } from 'lodash';
import { IItemEntry, ITaxTransaction } from '@/interfaces';
import HasTenancyService from '../Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { Knex } from 'knex';

@Service()
export class WriteTaxTransactionsItemEntries {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Writes the tax transactions from the given item entries.
   * @param {number} tenantId
   * @param {IItemEntry[]} itemEntries
   */
  public async writeTaxTransactionsFromItemEntries(
    tenantId: number,
    itemEntries: IItemEntry[],
    trx?: Knex.Transaction
  ) {
    const { TaxRateTransaction, TaxRate } = this.tenancy.models(tenantId);
    const aggregatedEntries = this.aggregateItemEntriesByTaxCode(itemEntries);

    const entriesTaxRateIds = aggregatedEntries.map((entry) => entry.taxRateId);

    const taxRates = await TaxRate.query(trx).whereIn('id', entriesTaxRateIds);
    const taxRatesById = keyBy(taxRates, 'id');

    const taxTransactions = aggregatedEntries.map((entry) => ({
      taxRateId: entry.taxRateId,
      referenceType: entry.referenceType,
      referenceId: entry.referenceId,
      rate: entry.taxRate || taxRatesById[entry.taxRateId]?.rate,
    })) as ITaxTransaction[];

    await TaxRateTransaction.query(trx).upsertGraph(taxTransactions);
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
    tenantId: number,
    itemEntries: IItemEntry[],
    referenceType: string,
    referenceId: number,
    trx?: Knex.Transaction
  ) {
    await Promise.all([
      this.removeTaxTransactionsFromItemEntries(
        tenantId,
        referenceId,
        referenceType,
        trx
      ),
      this.writeTaxTransactionsFromItemEntries(tenantId, itemEntries, trx),
    ]);
  }

  /**
   * Aggregates by tax code id and sums the amount.
   * @param {IItemEntry[]} itemEntries
   * @returns {IItemEntry[]}
   */
  private aggregateItemEntriesByTaxCode = (
    itemEntries: IItemEntry[]
  ): IItemEntry[] => {
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
    tenantId: number,
    referenceId: number,
    referenceType: string,
    trx?: Knex.Transaction
  ) {
    const { TaxRateTransaction } = this.tenancy.models(tenantId);

    await TaxRateTransaction.query(trx)
      .where({ referenceType, referenceId })
      .delete();
  }
}
