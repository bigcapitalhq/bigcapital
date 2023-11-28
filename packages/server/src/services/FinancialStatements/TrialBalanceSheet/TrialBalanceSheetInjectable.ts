import { Service, Inject } from 'typedi';
import moment from 'moment';
import TenancyService from '@/services/Tenancy/TenancyService';
import {
  ITrialBalanceSheetMeta,
  ITrialBalanceSheetQuery,
  ITrialBalanceStatement,
} from '@/interfaces';
import TrialBalanceSheet from './TrialBalanceSheet';
import FinancialSheet from '../FinancialSheet';
import InventoryService from '@/services/Inventory/Inventory';
import { parseBoolean } from 'utils';
import { Tenant } from '@/system/models';
import { TrialBalanceSheetRepository } from './TrialBalanceSheetRepository';

@Service()
export default class TrialBalanceSheetService extends FinancialSheet {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  inventoryService: InventoryService;

  @Inject('logger')
  logger: any;

  /**
   * Defaults trial balance sheet filter query.
   * @return {IBalanceSheetQuery}
   */
  private get defaultQuery(): ITrialBalanceSheetQuery {
    return {
      fromDate: moment().startOf('year').format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
      numberFormat: {
        divideOn1000: false,
        negativeFormat: 'mines',
        showZero: false,
        formatMoney: 'total',
        precision: 2,
      },
      basis: 'accrual',
      noneZero: false,
      noneTransactions: true,
      onlyActive: false,
      accountIds: [],
    };
  }

  /**
   * Retrieve the trial balance sheet meta.
   * @param {number} tenantId - Tenant id.
   * @returns {ITrialBalanceSheetMeta}
   */
  private reportMetadata(tenantId: number): ITrialBalanceSheetMeta {
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
   * Retrieve trial balance sheet statement.
   * @param {number} tenantId
   * @param {IBalanceSheetQuery} query
   * @return {IBalanceSheetStatement}
   */
  public async trialBalanceSheet(
    tenantId: number,
    query: ITrialBalanceSheetQuery
  ): Promise<ITrialBalanceStatement> {
    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    const models = this.tenancy.models(tenantId);
    const repos = this.tenancy.repositories(tenantId);

    const trialBalanceSheetRepos = new TrialBalanceSheetRepository(
      models,
      repos,
      filter
    );
    await trialBalanceSheetRepos.asyncInitialize();

    // Trial balance report instance.
    const trialBalanceInstance = new TrialBalanceSheet(
      tenantId,
      filter,
      trialBalanceSheetRepos,
      tenant.metadata.baseCurrency
    );
    // Trial balance sheet data.
    const trialBalanceSheetData = trialBalanceInstance.reportData();

    return {
      data: trialBalanceSheetData,
      query: filter,
      meta: this.reportMetadata(tenantId),
    };
  }
}
