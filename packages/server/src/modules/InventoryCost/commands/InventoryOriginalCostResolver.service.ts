import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { InventoryCostLotTracker } from '../models/InventoryCostLotTracker';

export interface OriginalCostSource {
  transactionType: 'SaleInvoice' | 'SaleReceipt' | 'Bill';
  transactionId: number;
  entryId: number;
  quantity: number;
}

type LinkedEntry = {
  id?: number;
  rate: number;
  quantity: number;
  sourceInvoiceId?: number;
  sourceInvoiceEntryId?: number;
  sourceReceiptId?: number;
  sourceReceiptEntryId?: number;
  sourceBillId?: number;
  sourceBillEntryId?: number;
  [key: string]: any;
};

/**
 * Resolves original unit cost from inventory cost lots for linked returns.
 */
@Injectable()
export class InventoryOriginalCostResolver {
  constructor(
    @Inject(InventoryCostLotTracker.name)
    private readonly inventoryCostLotTracker: TenantModelProxy<
      typeof InventoryCostLotTracker
    >,
  ) {}

  private buildSourceKey(source: OriginalCostSource): string {
    return `${source.transactionType}:${source.transactionId}:${source.entryId}`;
  }

  private resolveSourceFromEntry(
    entry: LinkedEntry,
  ): OriginalCostSource | null {
    if (entry.sourceInvoiceId && entry.sourceInvoiceEntryId) {
      return {
        transactionType: 'SaleInvoice',
        transactionId: entry.sourceInvoiceId,
        entryId: entry.sourceInvoiceEntryId,
        quantity: entry.quantity,
      };
    }

    if (entry.sourceReceiptId && entry.sourceReceiptEntryId) {
      return {
        transactionType: 'SaleReceipt',
        transactionId: entry.sourceReceiptId,
        entryId: entry.sourceReceiptEntryId,
        quantity: entry.quantity,
      };
    }

    if (entry.sourceBillId && entry.sourceBillEntryId) {
      return {
        transactionType: 'Bill',
        transactionId: entry.sourceBillId,
        entryId: entry.sourceBillEntryId,
        quantity: entry.quantity,
      };
    }

    return null;
  }

  /**
   * Returns unit cost (cost/qty) from matching lots, or null if none found.
   */
  public async getOriginalUnitCost(
    source: OriginalCostSource,
    trx?: Knex.Transaction,
  ): Promise<number | null> {
    const costs = await this.getOriginalUnitCosts([source], trx);
    return costs.get(this.buildSourceKey(source)) ?? null;
  }

  /**
   * Batch-resolve unit costs for linked return sources (single query).
   */
  public async getOriginalUnitCosts(
    sources: OriginalCostSource[],
    trx?: Knex.Transaction,
  ): Promise<Map<string, number>> {
    const uniqueSources = new Map<string, OriginalCostSource>();

    for (const source of sources) {
      uniqueSources.set(this.buildSourceKey(source), source);
    }

    if (!uniqueSources.size) {
      return new Map();
    }

    const lots = await this.inventoryCostLotTracker()
      .query(trx)
      .where((builder) => {
        let first = true;

        for (const source of uniqueSources.values()) {
          const clause = first
            ? builder.where.bind(builder)
            : builder.orWhere.bind(builder);
          first = false;

          clause(function () {
            this.where('transaction_type', source.transactionType)
              .where('transaction_id', source.transactionId)
              .where('entry_id', source.entryId)
              .where(
                'direction',
                source.transactionType === 'Bill' ? 'IN' : 'OUT',
              );
          });
        }
      });

    const grouped = new Map<string, InventoryCostLotTracker[]>();

    for (const lot of lots) {
      const key = `${lot.transactionType}:${lot.transactionId}:${lot.entryId}`;
      const group = grouped.get(key);

      if (group) {
        group.push(lot);
      } else {
        grouped.set(key, [lot]);
      }
    }

    const result = new Map<string, number>();

    for (const [key, sourceLots] of grouped) {
      const totalCost = sourceLots.reduce(
        (sum, lot) => sum + Number(lot.cost || 0),
        0,
      );
      const totalQty = sourceLots.reduce(
        (sum, lot) => sum + Number(lot.quantity || 0),
        0,
      );

      if (totalQty) {
        result.set(key, totalCost / totalQty);
      }
    }

    return result;
  }

  /**
   * Applies original COGS rates onto inventory entries that carry source links.
   * Mutates and returns entries with rate overridden when a source lot is found.
   */
  public async applyOriginalCostToEntries(
    entries: LinkedEntry[],
    trx?: Knex.Transaction,
  ) {
    const resolved = entries.map((entry) => ({
      entry,
      source: this.resolveSourceFromEntry(entry),
    }));
    const costMap = await this.getOriginalUnitCosts(
      resolved
        .filter(({ source }) => source)
        .map(({ source }) => source as OriginalCostSource),
      trx,
    );

    return resolved.map(({ entry, source }) => {
      if (!source) {
        return entry;
      }

      const unitCost = costMap.get(this.buildSourceKey(source));

      if (unitCost == null) {
        return entry;
      }

      return {
        ...entry,
        rate: unitCost,
      };
    });
  }
}
