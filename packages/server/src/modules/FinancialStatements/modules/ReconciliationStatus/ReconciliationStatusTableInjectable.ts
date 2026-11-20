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
    const table = new ReconciliationStatusTable(
      accounts,
      dateFormat,
      this.i18n,
    );
    const dateRange = [
      query.fromDate &&
        `${this.i18n.t('reconciliation_status.from')} ${moment(query.fromDate).format(dateFormat)}`,
      query.toDate &&
        `${this.i18n.t('reconciliation_status.to')} ${moment(query.toDate).format(dateFormat)}`,
    ]
      .filter(Boolean)
      .join(' | ');

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableRows(),
      },
      bankAccounts,
      meta: {
        organizationName: organization.name,
        sheetName: this.i18n.t('reconciliation_status.sheet_name'),
        formattedDateRange:
          dateRange || this.i18n.t('reconciliation_status.all_dates'),
        status: query.status ?? ReconciliationReportStatus.Reconciled,
      },
    };
  }
}
