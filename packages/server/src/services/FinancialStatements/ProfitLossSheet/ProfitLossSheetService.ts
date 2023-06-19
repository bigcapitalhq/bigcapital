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
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  @Inject()
  inventoryService: InventoryService;

  /**
   * Retrieve the trial balance sheet meta.
   * @param {number} tenantId - Tenant id.
   * @returns {ITrialBalanceSheetMeta}
   */
  reportMetadata(tenantId: number): IProfitLossSheetMeta {
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

  /**
   * Retrieve profit/loss sheet statement.
   * @param {number} tenantId
   * @param {IProfitLossSheetQuery} query
   * @return { }
   */
  profitLossSheet = async (
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

    // Get the given accounts or throw not found service error.
    // if (filter.accountsIds.length > 0) {
    //   await this.accountsService.getAccountsOrThrowError(
    //     tenantId,
    //     filter.accountsIds
    //   );
    // }
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
    // Profit/loss report data and columns.
    const profitLossData = profitLossInstance.reportData();

    return {
      data: profitLossData,
      query: filter,
      meta: this.reportMetadata(tenantId),
    };
  };
}
