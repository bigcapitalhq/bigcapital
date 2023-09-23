import { Inject, Service } from 'typedi';
import { keyBy, sumBy } from 'lodash';
import { ItemEntry } from '@/models';
import HasTenancyService from '../Tenancy/TenancyService';
import { IItem, IItemEntry, IItemEntryDTO } from '@/interfaces';

@Service()
export class ItemEntriesTaxTransactions {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Associates tax amount withheld to the model.
   * @param model
   * @returns
   */
  public assocTaxAmountWithheldFromEntries(model: any) {
    const entries = model.entries.map((entry) => ItemEntry.fromJson(entry));
    const taxAmountWithheld = sumBy(entries, 'taxAmount');

    if (taxAmountWithheld) {
      model.taxAmountWithheld = taxAmountWithheld;
    }
    return model;
  }

  /**
   * Associates tax rate id from tax code to entries.
   * @param {number} tenantId
   * @param {} model
   */
  public assocTaxRateIdFromCodeToEntries =
    (tenantId: number) => async (entries: any) => {
      const entriesWithCode = entries.filter((entry) => entry.taxCode);
      const taxCodes = entriesWithCode.map((entry) => entry.taxCode);

      const { TaxRate } = this.tenancy.models(tenantId);
      const foundTaxCodes = await TaxRate.query().whereIn('code', taxCodes);

      const taxCodesMap = keyBy(foundTaxCodes, 'code');

      return entries.map((entry) => {
        if (entry.taxCode) {
          entry.taxRateId = taxCodesMap[entry.taxCode]?.id;
        }
        return entry;
      });
    };

  /**
   * Associates tax rate from tax id to entries.
   * @param {number} tenantId
   * @returns {Promise<IItemEntry[]>}
   */
  public assocTaxRateFromTaxIdToEntries =
    (tenantId: number) => async (entries: IItemEntry[]) => {
      const entriesWithId = entries.filter((e) => e.taxRateId);
      const taxRateIds = entriesWithId.map((e) => e.taxRateId);

      const { TaxRate } = this.tenancy.models(tenantId);
      const foundTaxes = await TaxRate.query().whereIn('id', taxRateIds);

      const taxRatesMap = keyBy(foundTaxes, 'id');

      return entries.map((entry) => {
        if (entry.taxRateId) {
          entry.taxRate = taxRatesMap[entry.taxRateId]?.rate;
        }
        return entry;
      });
    };
}
