import { sumBy, chain } from 'lodash';
import { IItemEntry } from '@/interfaces';
import HasTenancyService from '../Tenancy/TenancyService';
import { Inject, Service } from 'typedi';

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
    itemEntries: IItemEntry[]
  ) {
    const { TaxRateTransaction } = this.tenancy.models(tenantId);
    const aggregatedEntries = this.aggregateItemEntriesByTaxCode(itemEntries);

    const taxTransactions = aggregatedEntries.map((entry) => ({
      taxName: 'TAX NAME',
      taxCode: 'TAG_CODE',
      referenceType: entry.referenceType,
      referenceId: entry.referenceId,
      taxAmount: entry.taxAmount,
    }));
    await TaxRateTransaction.query().upsertGraph(taxTransactions);
  }

  /**
   * 
   * @param {IItemEntry[]} itemEntries
   * @returns {}
   */
  private aggregateItemEntriesByTaxCode(itemEntries: IItemEntry[]) {
    return chain(itemEntries.filter((item) => item.taxCode))
      .groupBy((item) => item.taxCode)
      .values()
      .map((group) => ({ ...group[0], amount: sumBy(group, 'amount') }))
      .value();
  }

  /**
   * 
   * @param itemEntries
   */
  private aggregateItemEntriesByReferenceTypeId(itemEntries: IItemEntry) {}

  /**
   * Removes the tax transactions from the given item entries.
   * @param tenantId
   * @param itemEntries
   */
  public removeTaxTransactionsFromItemEntries(
    tenantId: number,
    itemEntries: IItemEntry[]
  ) {
    const { TaxRateTransaction } = this.tenancy.models(tenantId);

    const filteredEntries = itemEntries.filter((item) => item.taxCode);
  }
}
