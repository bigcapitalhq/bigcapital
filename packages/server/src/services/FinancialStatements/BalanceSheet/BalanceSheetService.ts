import { Service, Inject } from 'typedi';
import moment from 'moment';
import {
  IBalanceSheetStatementService,
  IBalanceSheetQuery,
  IBalanceSheetStatement,
  IBalanceSheetMeta,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import Journal from '@/services/Accounting/JournalPoster';
import BalanceSheetStatement from './BalanceSheet';
import InventoryService from '@/services/Inventory/Inventory';
import { parseBoolean } from 'utils';
import { Tenant } from '@/system/models';
import BalanceSheetRepository from './BalanceSheetRepository';

@Service()
export default class BalanceSheetStatementService
  implements IBalanceSheetStatementService
{
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  @Inject()
  inventoryService: InventoryService;

  /**
   * Defaults balance sheet filter query.
   * @return {IBalanceSheetQuery}
   */
  get defaultQuery(): IBalanceSheetQuery {
    return {
      displayColumnsType: 'total',
      displayColumnsBy: 'month',

      fromDate: moment().startOf('year').format('YYYY-MM-DD'),
      toDate: moment().endOf('year').format('YYYY-MM-DD'),

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
   * Retrieve the balance sheet meta.
   * @param {number} tenantId -
   * @returns {IBalanceSheetMeta}
   */
  private reportMetadata(tenantId: number): IBalanceSheetMeta {
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
   * Retrieve balance sheet statement.
   * -------------
   * @param {number} tenantId
   * @param {IBalanceSheetQuery} query
   *
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

    await balanceSheetRepo.asyncInitialize();

    // Balance sheet report instance.
    const balanceSheetInstance = new BalanceSheetStatement(
      filter,
      balanceSheetRepo,
      tenant.metadata.baseCurrency,
      i18n
    );
    // Balance sheet data.
    const balanceSheetData = balanceSheetInstance.reportData();

    return {
      data: balanceSheetData,
      query: filter,
      meta: this.reportMetadata(tenantId),
    };
  }
}
