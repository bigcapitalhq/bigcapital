import { Inject, Injectable } from '@nestjs/common';
import { keyBy, groupBy, sumBy } from 'lodash';
import { TaxRateModel } from '../models/TaxRate.model';
import { ItemEntryTax } from '../models/ItemEntryTax.model';
import { TenantModelProxy } from '../../System/models/TenantBaseModel';

export interface AggregatedTax {
  taxRateId: number;
  taxRate: number;
  name: string;
  code: string;
  totalAmount: number;
  isCompound: boolean;
}

@Injectable()
export class AggregateEntriesTaxesService {
  constructor(
    @Inject(ItemEntryTax.name)
    private itemEntryTaxModel: TenantModelProxy<typeof ItemEntryTax>,

    @Inject(TaxRateModel.name)
    private taxRateModel: TenantModelProxy<typeof TaxRateModel>,
  ) {}

  /**
   * Retrieves aggregated taxes from item entries for a given reference.
   * @param referenceType - Type of reference (e.g., 'SaleInvoice', 'Bill')
   * @param referenceId - ID of the reference
   * @returns Aggregated taxes by tax rate
   */
  public async getAggregatedTaxesForReference(
    referenceType: string,
    referenceId: number,
  ): Promise<AggregatedTax[]> {
    // Get all entry taxes for this reference through item entries
    const entryTaxes = await this.itemEntryTaxModel()
      .query()
      .withGraphFetched('taxRateRef')
      .whereExists(
        this.itemEntryTaxModel()
          .relatedQuery('itemEntry')
          .where('reference_type', referenceType)
          .where('reference_id', referenceId),
      );

    // Group by tax rate ID and sum amounts
    const taxesByRateId = groupBy(entryTaxes, 'taxRateId');

    return Object.entries(taxesByRateId).map(([taxRateId, taxes]) => {
      const firstTax = taxes[0];
      const taxRateRef = firstTax.taxRateRef;

      return {
        taxRateId: parseInt(taxRateId, 10),
        taxRate: taxRateRef?.rate || firstTax.taxRate,
        name: taxRateRef?.name || '',
        code: taxRateRef?.code || '',
        totalAmount: sumBy(taxes, 'taxAmount'),
        isCompound: taxRateRef?.isCompound || false,
      };
    });
  }

  /**
   * Retrieves aggregated taxes from item entries array.
   * @param entries - Item entries with taxes loaded
   * @returns Aggregated taxes by tax rate
   */
  public aggregateTaxesFromEntries(entries: any[]): AggregatedTax[] {
    const aggregated = new Map<number, AggregatedTax>();

    for (const entry of entries) {
      if (!entry.taxes || entry.taxes.length === 0) continue;

      for (const tax of entry.taxes) {
        const existing = aggregated.get(tax.taxRateId);
        const taxRateRef = tax.taxRateRef;

        if (existing) {
          existing.totalAmount += tax.taxAmount || 0;
        } else {
          aggregated.set(tax.taxRateId, {
            taxRateId: tax.taxRateId,
            taxRate: taxRateRef?.rate || tax.taxRate,
            name: taxRateRef?.name || '',
            code: taxRateRef?.code || '',
            totalAmount: tax.taxAmount || 0,
            isCompound: taxRateRef?.isCompound || false,
          });
        }
      }
    }

    return Array.from(aggregated.values());
  }
}
