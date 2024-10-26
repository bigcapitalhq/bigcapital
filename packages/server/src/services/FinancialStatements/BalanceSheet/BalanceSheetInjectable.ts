import { Service, Inject } from 'typedi';
import moment from 'moment';
import {
  IBalanceSheetStatementService,
  IBalanceSheetQuery,
  IBalanceSheetStatement,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import BalanceSheetStatement from './BalanceSheet';
import { Tenant } from '@/system/models';
import BalanceSheetRepository from './BalanceSheetRepository';
import { BalanceSheetMetaInjectable } from './BalanceSheetMeta';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export default class BalanceSheetStatementService
  implements IBalanceSheetStatementService
{
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private balanceSheetMeta: BalanceSheetMetaInjectable;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Defaults balance sheet filter query.
   * @return {IBalanceSheetQuery}
   */
  get defaultQuery(): IBalanceSheetQuery {
    return {
      displayColumnsType: 'total',
      displayColumnsBy: 'month',

      fromDate: moment().startOf('year').format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),

      numberFormat: {
        precision: 2,
        divideOn1000: false,
        showZero: false,
        formatMoney: 'total',
        negativeFormat: 'mines',
      },
      noneZero: false,
      noneTransactions: false,

      basis: 'cash',
      accountIds: [],

      percentageOfColumn: false,
      percentageOfRow: false,

      previousPeriod: false,
      previousPeriodAmountChange: false,
      previousPeriodPercentageChange: false,

      previousYear: false,
      previousYearAmountChange: false,
      previousYearPercentageChange: false,
    };
  }

  /**
   * Retrieve balance sheet statement.
   * @param {number} tenantId
   * @param {IBalanceSheetQuery} query
   * @return {IBalanceSheetStatement}
   */
  public async balanceSheet(
    tenantId: number,
    query: IBalanceSheetQuery
  ): Promise<IBalanceSheetStatement> {
    const i18n = this.tenancy.i18n(tenantId);

    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    const models = this.tenancy.models(tenantId);
    const balanceSheetRepo = new BalanceSheetRepository(models, filter);

    // Loads all resources.
    await balanceSheetRepo.asyncInitialize();

    // Balance sheet report instance.
    const balanceSheetInstanace = new BalanceSheetStatement(
      filter,
      balanceSheetRepo,
      tenant.metadata.baseCurrency,
      i18n
    );
    // Balance sheet data.
    const data = balanceSheetInstanace.reportData();

    // Balance sheet meta.
    const meta = await this.balanceSheetMeta.meta(tenantId, filter);

    // Triggers `onBalanceSheetViewed` event.
    await this.eventPublisher.emitAsync(events.reports.onBalanceSheetViewed, {
      query,
    });
    return {
      query: filter,
      data,
      meta,
    };
  }
}
