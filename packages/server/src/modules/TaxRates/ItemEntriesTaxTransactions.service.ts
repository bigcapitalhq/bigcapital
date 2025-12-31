import { Inject, Injectable } from '@nestjs/common';
import { keyBy, sumBy, flatten, uniq } from 'lodash';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { TaxRateModel } from './models/TaxRate.model';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { TaxCalculatorService } from './TaxCalculator.service';

@Injectable()
export class ItemEntriesTaxTransactions {
  constructor(
    @Inject(ItemEntry.name)
    private itemEntryModel: TenantModelProxy<typeof ItemEntry>,

    @Inject(TaxRateModel.name)
    private taxRateModel: TenantModelProxy<typeof TaxRateModel>,

    private taxCalculator: TaxCalculatorService,
  ) {}

  /**
   * Associates tax amount withheld to the model from entry taxes.
   * @param model - Model with entries containing taxes array
   * @returns Model with taxAmountWithheld
   */
  public assocTaxAmountWithheldFromEntries = (model: any) => {
    let totalTaxAmount = 0;

    for (const entry of model.entries) {
      if (entry.taxes && entry.taxes.length > 0) {
        totalTaxAmount += entry.taxes.reduce(
          (sum: number, t: any) => sum + (t.taxAmount || 0),
          0,
        );
      }
    }

    if (totalTaxAmount) {
      model.taxAmountWithheld = totalTaxAmount;
    }
    return model;
  };

  /**
   * Associates tax rate id from tax code to entries.
   * @param {any} entries
   */
  public assocTaxRateIdFromCodeToEntries = async (entries: any) => {
    const entriesWithCode = entries.filter((entry) => entry.taxCode);
    const taxCodes = entriesWithCode.map((entry) => entry.taxCode);
    const foundTaxCodes = await this.taxRateModel()
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
   * Associates tax rates from taxRateIds array to entries.
   * Supports multiple taxes per entry including compound taxes.
   * @param entries - Entry DTOs with taxRateIds
   * @param isInclusiveTax - Whether taxes are inclusive
   * @returns Entries with calculated taxes
   */
  public assocTaxRatesFromTaxIdsToEntries = async (
    entries: any[],
    isInclusiveTax: boolean,
  ) => {
    // Collect all unique tax rate IDs from all entries
    const allTaxRateIds = uniq(
      flatten(
        entries
          .filter((e) => e.taxRateIds && e.taxRateIds.length > 0)
          .map((e) => e.taxRateIds),
      ),
    );

    if (allTaxRateIds.length === 0) {
      return entries;
    }

    const foundTaxRates = await this.taxRateModel()
      .query()
      .whereIn('id', allTaxRateIds);

    const taxRatesMap = keyBy(foundTaxRates, 'id');

    return entries.map((entry) => {
      if (entry.taxRateIds && entry.taxRateIds.length > 0) {
        const taxInfos = entry.taxRateIds
          .map((id: number) => taxRatesMap[id])
          .filter(Boolean)
          .map((tax: any) => ({
            id: tax.id,
            rate: tax.rate,
            isCompound: tax.isCompound || false,
            name: tax.name,
            code: tax.code,
          }));

        // Calculate base amount for this entry
        const baseAmount = (entry.quantity || 0) * (entry.rate || 0);

        // Apply discount before calculating taxes
        const discountAmount =
          entry.discountType === 'percentage'
            ? baseAmount * ((entry.discount || 0) / 100)
            : entry.discount || 0;

        const amount = baseAmount - discountAmount;

        // Calculate taxes using the calculator service
        const taxResults = this.taxCalculator.calculateTaxes(
          amount,
          taxInfos,
          isInclusiveTax,
        );

        // Add calculated taxes to entry
        entry.calculatedTaxes = taxResults;
        entry.totalTaxAmount = this.taxCalculator.getTotalTaxAmount(taxResults);
      }

      return entry;
    });
  };
}
