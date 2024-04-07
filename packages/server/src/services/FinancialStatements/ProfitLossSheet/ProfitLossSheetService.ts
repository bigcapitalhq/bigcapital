import { IProfitLossSheetMeta, IProfitLossSheetNode, IProfitLossSheetQuery } from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import { Tenant } from '@/system/models';
import { Inject, Service } from 'typedi';
import ProfitLossSheet from './ProfitLossSheet';
import { ProfitLossSheetMeta } from './ProfitLossSheetMeta';
import { ProfitLossSheetRepository } from './ProfitLossSheetRepository';
import { mergeQueryWithDefaults } from './utils';

// Profit/Loss sheet service.
@Service()
export default class ProfitLossSheetService {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private profitLossSheetMeta: ProfitLossSheetMeta;

  /**
   * Retrieve profit/loss sheet statement.
   * @param {number} tenantId
   * @param {IProfitLossSheetQuery} query
   * @return { }
   */
  public profitLossSheet = async (
    tenantId: number,
    query: IProfitLossSheetQuery,
  ): Promise<{
    data: IProfitLossSheetNode[];
    query: IProfitLossSheetQuery;
    meta: IProfitLossSheetMeta;
  }> => {
    const models = this.tenancy.models(tenantId);
    const i18n = this.tenancy.i18n(tenantId);

    // Merges the given query with default filter query.
    const filter = mergeQueryWithDefaults(query);

    const tenant = await Tenant.query().findById(tenantId).withGraphFetched('metadata');

    const profitLossRepo = new ProfitLossSheetRepository(models, filter);

    // Loads the profit/loss sheet data.
    await profitLossRepo.asyncInitialize();

    // Profit/Loss report instance.
    const profitLossInstance = new ProfitLossSheet(profitLossRepo, filter, tenant.metadata.baseCurrency, i18n);
    // Profit/loss report data and collumns.
    const data = profitLossInstance.reportData();

    // Retrieve the profit/loss sheet meta.
    const meta = await this.profitLossSheetMeta.meta(tenantId, filter);

    return {
      query: filter,
      data,
      meta,
    };
  };
}
