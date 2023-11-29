import { Service, Inject } from 'typedi';
import {
  IProfitLossSheetQuery,
  IProfitLossSheetMeta,
  IProfitLossSheetNode,
} from '@/interfaces';
import ProfitLossSheet from './ProfitLossSheet';
import TenancyService from '@/services/Tenancy/TenancyService';
import InventoryService from '@/services/Inventory/Inventory';
import { parseBoolean } from 'utils';
import { Tenant } from '@/system/models';
import { mergeQueryWithDefaults } from './utils';
import { ProfitLossSheetRepository } from './ProfitLossSheetRepository';

// Profit/Loss sheet service.
@Service()
export default class ProfitLossSheetService {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private inventoryService: InventoryService;

  /**
   * Retrieve profit/loss sheet statement.
   * @param {number} tenantId
   * @param {IProfitLossSheetQuery} query
   * @return { }
   */
  public profitLossSheet = async (
    tenantId: number,
    query: IProfitLossSheetQuery
  ): Promise<{
    data: IProfitLossSheetNode[];
    query: IProfitLossSheetQuery;
    meta: IProfitLossSheetMeta;
  }> => {
    const models = this.tenancy.models(tenantId);
    const i18n = this.tenancy.i18n(tenantId);

    // Merges the given query with default filter query.
    const filter = mergeQueryWithDefaults(query);

    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    const profitLossRepo = new ProfitLossSheetRepository(models, filter);

    await profitLossRepo.asyncInitialize();

    // Profit/Loss report instance.
    const profitLossInstance = new ProfitLossSheet(
      profitLossRepo,
      filter,
      tenant.metadata.baseCurrency,
      i18n
    );
    // Profit/loss report data and collumns.
    const profitLossData = profitLossInstance.reportData();

    return {
      data: profitLossData,
      query: filter,
      meta: this.reportMetadata(tenantId),
    };
  };

  /**
   * Retrieve the trial balance sheet meta.
   * @param {number} tenantId - Tenant id.
   * @returns {ITrialBalanceSheetMeta}
   */
  private reportMetadata(tenantId: number): IProfitLossSheetMeta {
    const settings = this.tenancy.settings(tenantId);

    const isCostComputeRunning =
      this.inventoryService.isItemsCostComputeRunning(tenantId);
    const organizationName = settings.get({
      group: 'organization',
      key: 'name',
    });
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });

    return {
      isCostComputeRunning: parseBoolean(isCostComputeRunning, false),
      organizationName,
      baseCurrency,
    };
  }
}
