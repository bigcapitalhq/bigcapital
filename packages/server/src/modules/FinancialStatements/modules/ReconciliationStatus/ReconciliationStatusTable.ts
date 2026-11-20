import * as moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import { FinancialSheet } from '../../common/FinancialSheet';
import { FinancialTable } from '../../common/FinancialTable';
import { ITableColumn } from '../../types/Table.types';
import {
  ReconciliationStatusAccountReportDto,
  ReconciliationStatusTableRowDto,
} from './ReconciliationStatusResponse.dto';
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

export class ReconciliationStatusTable extends FinancialTable(FinancialSheet) {
  /**
   * Reconciliation status report accounts.
   * @param {ReconciliationStatusAccountReportDto[]}
   */
  public readonly accounts: ReconciliationStatusAccountReportDto[];

  public i18n: I18nService;

  /**
   * Constructor method.
   * @param {ReconciliationStatusAccountReportDto[]} accounts - The report accounts.
   * @param {string} dateFormat - The organization date format.
   * @param {I18nService} i18n - The i18n service.
   */
  constructor(
    accounts: ReconciliationStatusAccountReportDto[],
    dateFormat: string,
    i18n: I18nService,
  ) {
    super();

    this.accounts = accounts;
    this.dateFormat = dateFormat;
    this.i18n = i18n;
  }

  /**
   * Retrieves the table columns.
   * @returns {ITableColumn[]}
   */
  public tableColumns = (): ITableColumn[] => {
    return this.tableColumnsCellIndexing(
      COLUMN_KEYS.map((key) => ({
        key,
        label: this.i18n.t(`reconciliation_status.${key}`),
      })),
    );
  };

  /**
   * Retrieves the table rows.
   * @returns {ReconciliationStatusTableRowDto[]}
   */
  public tableRows = (): ReconciliationStatusTableRowDto[] => {
    return this.accounts.flatMap((account) => this.accountRows(account));
  };

  /**
   * Maps the given account report to table rows.
   * @param {ReconciliationStatusAccountReportDto} account
   * @returns {ReconciliationStatusTableRowDto[]}
   */
  private accountRows = (
    account: ReconciliationStatusAccountReportDto,
  ): ReconciliationStatusTableRowDto[] => {
    const { id, currencyCode, transactions } = account;
    const formatAmount = (amount: number) =>
      formatNumber(amount, {
        currencyCode,
        precision: Currencies[currencyCode]?.decimal_digits,
      });

    const transactionRows = transactions.map((transaction) =>
      this.row(`transaction-${transaction.id}`, 'TRANSACTION', {
        date: transaction.date
          ? moment(transaction.date).format(this.dateFormat)
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
      this.row(`account-${id}`, 'ACCOUNT', {
        date: `${account.name} (${currencyCode})`,
      }),
      this.row(`opening-balance-${id}`, 'OPENING_BALANCE', {
        date: this.i18n.t('reconciliation_status.opening_balance'),
        withdrawal: formatAmount(account.openingBalance),
      }),
      ...(transactionRows.length > 0
        ? transactionRows
        : [
            this.row(`no-transactions-${id}`, 'NO_TRANSACTIONS', {
              date: this.i18n.t('reconciliation_status.no_transactions'),
            }),
          ]),
      this.row(`closing-balance-${id}`, 'CLOSING_BALANCE', {
        date: this.i18n.t('reconciliation_status.closing_balance'),
        withdrawal: formatAmount(account.closingBalance),
      }),
    ];
  };

  /**
   * Constructs the table row with the given values.
   * @param {string} id - The row id.
   * @param {string} rowType - The row type.
   * @param {Partial<Record<ColumnKey, string>>} values - The cell values.
   * @returns {ReconciliationStatusTableRowDto}
   */
  private row = (
    id: string,
    rowType: string,
    values: Partial<Record<ColumnKey, string>>,
  ): ReconciliationStatusTableRowDto => ({
    id,
    rowTypes: [rowType],
    cells: COLUMN_KEYS.map((key) => ({ key, value: values[key] ?? '' })),
  });
}
