import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import { ReconciliationStatusTable } from './ReconciliationStatusTable';
import { ReconciliationStatusService } from './ReconciliationStatus.service';
import {
  ReconciliationReportStatus,
  ReconciliationStatusQueryDto,
} from './ReconciliationStatusQuery.dto';
import { ReconciliationStatusTableResponseDto } from './ReconciliationStatusResponse.dto';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { getReconciliationDateLocale } from '@/modules/BankingReconciliation/reconciliation-localization';

@Injectable()
export class ReconciliationStatusTableInjectable {
  constructor(
    private readonly report: ReconciliationStatusService,
    private readonly tenancyContext: TenancyContext,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the reconciliation status report in json table format.
   * @param {ReconciliationStatusQueryDto} query
   * @returns {Promise<ReconciliationStatusTableResponseDto>}
   */
  public async table(
    query: ReconciliationStatusQueryDto,
  ): Promise<ReconciliationStatusTableResponseDto> {
    const [{ accounts, bankAccounts }, organization] = await Promise.all([
      this.report.getReport(query),
      this.tenancyContext.getTenantMetadata(),
    ]);
    const dateFormat = organization.dateFormat || 'DD MMM YYYY';
    const dateLocale = getReconciliationDateLocale();
    const table = new ReconciliationStatusTable(
      accounts,
      dateFormat,
      this.i18n,
      dateLocale,
    );
    const formatDate = (date: string) =>
      moment(date).locale(dateLocale).format(dateFormat);
    const dates = {
      fromDate: query.fromDate ? formatDate(query.fromDate) : '',
      toDate: query.toDate ? formatDate(query.toDate) : '',
    };
    const dateRangeKey = dates.fromDate
      ? dates.toDate
        ? 'date_range'
        : 'from_date'
      : dates.toDate
        ? 'to_date'
        : 'all_dates';

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableRows(),
      },
      bankAccounts,
      meta: {
        organizationName: organization.name,
        sheetName: this.i18n.t('reconciliation_status.sheet_name'),
        formattedDateRange: this.i18n.t(
          `reconciliation_status.${dateRangeKey}`,
          { args: dates },
        ),
        status: query.status ?? ReconciliationReportStatus.Reconciled,
      },
    };
  }
}
