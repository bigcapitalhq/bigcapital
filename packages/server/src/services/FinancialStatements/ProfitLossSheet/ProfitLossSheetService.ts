import { Service, Inject } from 'typedi';
import {
  IProfitLossSheetQuery,
  IProfitLossSheetMeta,
  IProfitLossSheetNode,
} from '@/interfaces';
import ProfitLossSheet from './ProfitLossSheet';
import TenancyService from '@/services/Tenancy/TenancyService';
import { Tenant } from '@/system/models';
import { mergeQueryWithDefaults } from './utils';
import { ProfitLossSheetRepository } from './ProfitLossSheetRepository';
import { ProfitLossSheetMeta } from './ProfitLossSheetMeta';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

// Profit/Loss sheet service.
@Service()
export default class ProfitLossSheetService {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private profitLossSheetMeta: ProfitLossSheetMeta;

  @Inject()
  private eventPublisher: EventPublisher;

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

    // Loads the profit/loss sheet data.
    await profitLossRepo.asyncInitialize();

    // Profit/Loss report instance.
    const profitLossInstance = new ProfitLossSheet(
      profitLossRepo,
      filter,
      tenant.metadata.baseCurrency,
      i18n
    );
    // Profit/loss report data and collumns.
    const data = profitLossInstance.reportData();

    // Retrieve the profit/loss sheet meta.
    const meta = await this.profitLossSheetMeta.meta(tenantId, filter);

    // Triggers `onProfitLossSheetViewed` event.
    await this.eventPublisher.emitAsync(
      events.reports.onProfitLossSheetViewed,
      {
        tenantId,
        query,
      }
    );

    return {
      query: filter,
      data,
      meta,
    };
  };
}
