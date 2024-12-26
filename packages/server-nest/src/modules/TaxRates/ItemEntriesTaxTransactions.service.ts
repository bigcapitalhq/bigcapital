import { Inject, Injectable } from '@nestjs/common';
import { keyBy, sumBy } from 'lodash';
import { ItemEntry } from '@/modules/Items/models/ItemEntry';
import { TaxRateModel } from './models/TaxRate.model';

@Injectable()
export class ItemEntriesTaxTransactions {
  constructor(
    @Inject(ItemEntry.name) private itemEntryModel: typeof ItemEntry,
    @Inject(TaxRateModel.name) private taxRateModel: typeof TaxRateModel,
  ) {}

  /**
   * Associates tax amount withheld to the model.
   * @param model
   * @returns
   */
  public assocTaxAmountWithheldFromEntries = (model: any) => {
    const entries = model.entries.map((entry) =>
      this.itemEntryModel.fromJson(entry),
    );
    const taxAmountWithheld = sumBy(entries, 'taxAmount');

    if (taxAmountWithheld) {
      model.taxAmountWithheld = taxAmountWithheld;
    }
    return model;
  }

  /**
   * Associates tax rate id from tax code to entries.
   * @param {any} entries
   */
  public assocTaxRateIdFromCodeToEntries = async (entries: any) => {
      const entriesWithCode = entries.filter((entry) => entry.taxCode);
      const taxCodes = entriesWithCode.map((entry) => entry.taxCode);
      const foundTaxCodes = await this.taxRateModel
        .query()
        .whereIn('code', taxCodes);

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
   * @returns {Promise<ItemEntry[]>}
   */
  public assocTaxRateFromTaxIdToEntries = async (entries: ItemEntry[]) => {
      const entriesWithId = entries.filter((e) => e.taxRateId);
      const taxRateIds = entriesWithId.map((e) => e.taxRateId);
      const foundTaxes = await this.taxRateModel
        .query()
        .whereIn('id', taxRateIds);

      const taxRatesMap = keyBy(foundTaxes, 'id');

      return entries.map((entry) => {
        if (entry.taxRateId) {
          entry.taxRate = taxRatesMap[entry.taxRateId]?.rate;
        }
        return entry;
      });
    };
}
