import { Injectable } from '@nestjs/common';
import {
  IInventorySummaryQuery,
  IInventorySummarySheet,
} from './InventorySummary.types';
import { InventorySummaryRepository } from './InventorySummaryRepository';
import { InventorySummaryReport } from './InventorySummary';
import { InventorySummaryMeta } from './InventorySummaryMeta';
import { getInventorySummaryDefaultQuery } from './constants';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class InventorySummaryService {
  constructor(
    private readonly inventorySummaryRepository: InventorySummaryRepository,
    private readonly inventorySummaryMeta: InventorySummaryMeta,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Retrieve the inventory summary report data.
   * @param {IInventorySummaryQuery} query
   * @returns {Promise<IInventorySummarySheet>}
   */
  public async inventorySummary(
    query: IInventorySummaryQuery,
  ): Promise<IInventorySummarySheet> {
    const filter: IInventorySummaryQuery = {
      ...getInventorySummaryDefaultQuery(),
      ...query,
    };

    this.inventorySummaryRepository.setFilter(filter);
    await this.inventorySummaryRepository.asyncInit();

    const [meta, tenantMetadata] = await Promise.all([
      this.inventorySummaryMeta.meta(filter),
      this.tenancyContext.getTenantMetadata(),
    ]);

    const report = new InventorySummaryReport(
      filter,
      this.inventorySummaryRepository,
      {
        baseCurrency: tenantMetadata.baseCurrency,
        dateFormat: meta.dateFormat,
      },
    );

    return {
      data: report.reportData(),
      query: filter,
      meta,
    };
  }
}
