import { Injectable } from '@nestjs/common';
import { escape } from 'lodash';
import * as moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import { TableSheet } from '../../common/TableSheet';
import { TableSheetPdf } from '../../common/TableSheetPdf';
import { ITableCell } from '../../types/Table.types';
import { ReconciliationStatusService } from './ReconciliationStatus.service';
import {
  ReconciliationReportStatus,
  ReconciliationStatusQueryDto,
} from './ReconciliationStatusQuery.dto';
import {
  ReconciliationStatusAccountReportDto,
  ReconciliationStatusTableDataDto,
  ReconciliationStatusTableResponseDto,
  ReconciliationStatusTableRowDto,
} from './ReconciliationStatusResponse.dto';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { Currencies } from '@/utils/currencies';
import { formatNumber } from '@/utils/format-number';

const COLUMN_KEYS = [
  'date',
  'reference',
  'type',
  'deposit',
  'withdrawal',
  'status',
] as const;
type ColumnKey = (typeof COLUMN_KEYS)[number];

const PDF_TABLE_CSS = `
  table .column--deposit,
  table .column--withdrawal,
  table .cell--deposit,
  table .cell--withdrawal { text-align: right; white-space: nowrap; }
  table .row-type--account td,
  table .row-type--opening-balance td,
  table .row-type--closing-balance td { font-weight: 600; }
  table .row-type--account td,
  table .row-type--closing-balance td { border-top: 1px solid #ececec; }
`;

@Injectable()
export class ReconciliationStatusFormats {
  constructor(
    private readonly report: ReconciliationStatusService,
    private readonly tenancyContext: TenancyContext,
    private readonly i18n: I18nService,
    private readonly tableSheetPdf: TableSheetPdf,
  ) {}

  public async table(
    query: ReconciliationStatusQueryDto,
  ): Promise<ReconciliationStatusTableResponseDto> {
    const [{ accounts, bankAccounts }, organization] = await Promise.all([
      this.report.getReport(query),
      this.tenancyContext.getTenantMetadata(),
    ]);
    const dateFormat = organization.dateFormat || 'DD MMM YYYY';
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
        columns: COLUMN_KEYS.map((key, cellIndex) => ({
          key,
          label: this.i18n.t(`reconciliation_status.${key}`),
          cellIndex,
        })),
        rows: accounts.flatMap((account) =>
          this.accountRows(account, dateFormat),
        ),
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

  public async csv(query: ReconciliationStatusQueryDto): Promise<string> {
    const { table } = await this.table(query);

    // Keep text fields literal when a spreadsheet opens the CSV.
    const csvTable = this.mapCellValues(table, ({ key, value }) =>
      key !== 'deposit' &&
      key !== 'withdrawal' &&
      (/^\s*[=+\-@]/.test(value) || /^[\t\r\n]/.test(value))
        ? `'${value}`
        : value,
    );
    return new TableSheet(csvTable).convertToCSV();
  }

  public async xlsx(query: ReconciliationStatusQueryDto): Promise<Buffer> {
    const { table } = await this.table(query);
    const sheet = new TableSheet(table);

    return sheet.convertToBuffer(sheet.convertToXLSX(), 'xlsx');
  }

  public async pdf(query: ReconciliationStatusQueryDto): Promise<Buffer> {
    const { table, meta } = await this.table(query);
    const mode = this.i18n.t(
      meta.status === ReconciliationReportStatus.Reconciled
        ? 'reconciliation_status.reconciled'
        : 'reconciliation_status.unreconciled',
    );

    // The shared PDF template accepts HTML in cells.
    const pdfTable = this.mapCellValues(table, ({ value }) => escape(value));

    return this.tableSheetPdf.convertToPdf(
      pdfTable,
      meta.organizationName,
      `${meta.sheetName} (${mode})`,
      meta.formattedDateRange,
      PDF_TABLE_CSS,
    );
  }

  private accountRows(
    account: ReconciliationStatusAccountReportDto,
    dateFormat: string,
  ): ReconciliationStatusTableRowDto[] {
    const { id, currencyCode, transactions } = account;
    const row = (
      id: string,
      rowType: string,
      values: Partial<Record<ColumnKey, string>>,
    ): ReconciliationStatusTableRowDto => ({
      id,
      rowTypes: [rowType],
      cells: COLUMN_KEYS.map((key) => ({ key, value: values[key] ?? '' })),
    });
    const formatAmount = (amount: number) =>
      formatNumber(amount, {
        currencyCode,
        precision: Currencies[currencyCode]?.decimal_digits,
      });

    const transactionRows = transactions.map((transaction) =>
      row(`transaction-${transaction.id}`, 'TRANSACTION', {
        date: transaction.date
          ? moment(transaction.date).format(dateFormat)
          : '—',
        reference: transaction.reference || '—',
        type: transaction.type || '—',
        deposit: transaction.deposit ? formatAmount(transaction.deposit) : '—',
        withdrawal: transaction.withdrawal
          ? formatAmount(transaction.withdrawal)
          : '—',
        status: transaction.status,
      }),
    );
    return [
      row(`account-${id}`, 'ACCOUNT', {
        date: `${account.name} (${currencyCode})`,
      }),
      row(`opening-balance-${id}`, 'OPENING_BALANCE', {
        date: this.i18n.t('reconciliation_status.opening_balance'),
        withdrawal: formatAmount(account.openingBalance),
      }),
      ...(transactionRows.length > 0
        ? transactionRows
        : [
            row(`no-transactions-${id}`, 'NO_TRANSACTIONS', {
              date: this.i18n.t('reconciliation_status.no_transactions'),
            }),
          ]),
      row(`closing-balance-${id}`, 'CLOSING_BALANCE', {
        date: this.i18n.t('reconciliation_status.closing_balance'),
        withdrawal: formatAmount(account.closingBalance),
      }),
    ];
  }

  private mapCellValues(
    table: ReconciliationStatusTableDataDto,
    transform: (cell: ITableCell) => string,
  ): ReconciliationStatusTableDataDto {
    return {
      ...table,
      rows: table.rows.map((row) => ({
        ...row,
        cells: row.cells.map((cell) => ({ ...cell, value: transform(cell) })),
      })),
    };
  }
}
