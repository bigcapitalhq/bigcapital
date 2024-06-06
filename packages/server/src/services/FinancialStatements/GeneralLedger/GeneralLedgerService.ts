import { Service, Inject } from 'typedi';
import moment from 'moment';
import { IGeneralLedgerSheetQuery, IGeneralLedgerMeta } from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import GeneralLedgerSheet from '@/services/FinancialStatements/GeneralLedger/GeneralLedger';
import { GeneralLedgerMeta } from './GeneralLedgerMeta';
import { GeneralLedgerRepository } from './GeneralLedgerRepository';

@Service()
export class GeneralLedgerService {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private generalLedgerMeta: GeneralLedgerMeta;

  /**
   * Defaults general ledger report filter query.
   * @return {IBalanceSheetQuery}
   */
  get defaultQuery() {
    return {
      fromDate: moment().startOf('month').format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
      basis: 'cash',
      numberFormat: {
        noCents: false,
        divideOn1000: false,
      },
      noneZero: false,
      accountsIds: [],
    };
  }

  /**
   * Retrieve general ledger report statement.
   * @param {number} tenantId
   * @param {IGeneralLedgerSheetQuery} query
   * @return {Promise<IGeneralLedgerStatement>}
   */
  public async generalLedger(
    tenantId: number,
    query: IGeneralLedgerSheetQuery
  ): Promise<{
    data: any;
    query: IGeneralLedgerSheetQuery;
    meta: IGeneralLedgerMeta;
  }> {
    const repositories = this.tenancy.repositories(tenantId);
    const i18n = this.tenancy.i18n(tenantId);

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    const genealLedgerRepository = new GeneralLedgerRepository(
      repositories,
      query,
      tenantId
    );
    await genealLedgerRepository.asyncInitialize();

    // General ledger report instance.
    const generalLedgerInstance = new GeneralLedgerSheet(
      filter,
      genealLedgerRepository,
      i18n
    );
    // Retrieve general ledger report data.
    const reportData = generalLedgerInstance.reportData();

    // Retrieve general ledger report metadata.
    const meta = await this.generalLedgerMeta.meta(tenantId, filter);

    return {
      data: reportData,
      query: filter,
      meta,
    };
  }
}
