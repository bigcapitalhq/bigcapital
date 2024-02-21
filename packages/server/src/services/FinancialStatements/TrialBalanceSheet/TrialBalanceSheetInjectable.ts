import { Service, Inject } from 'typedi';
import moment from 'moment';
import TenancyService from '@/services/Tenancy/TenancyService';
import { ITrialBalanceSheetQuery, ITrialBalanceStatement } from '@/interfaces';
import TrialBalanceSheet from './TrialBalanceSheet';
import FinancialSheet from '../FinancialSheet';
import { Tenant } from '@/system/models';
import { TrialBalanceSheetRepository } from './TrialBalanceSheetRepository';
import { TrialBalanceSheetMeta } from './TrialBalanceSheetMeta';

@Service()
export default class TrialBalanceSheetService extends FinancialSheet {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private trialBalanceSheetMetaService: TrialBalanceSheetMeta;

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
    // Loads the resources.
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

    // Trial balance sheet meta.
    const meta = await this.trialBalanceSheetMetaService.meta(tenantId, filter);

    return {
      data: trialBalanceSheetData,
      query: filter,
      meta,
    };
  }
}
