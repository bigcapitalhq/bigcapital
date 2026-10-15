import { flow } from 'fp-ts/function';
import { I18nService } from 'nestjs-i18n';
import { FinancialTable } from '../../common/FinancialTable';
import { FinancialSheet } from '../../common/FinancialSheet';
import { FinancialSheetStructure } from '../../common/FinancialSheetStructure';
import {
  IColumnMapperMeta,
  ITableColumn,
  ITableRow,
} from '../../types/Table.types';
import { tableRowMapper } from '../../utils/Table.utils';
import { BUDGET_VS_ACTUAL_COLUMN_KEYS } from '../../common/constants/tableColumnKeys';
import {
  IBudgetVsActualAccountRow,
  IBudgetVsActualPeriod,
  IBudgetVsActualQuery,
  IBudgetVsActualReportData,
} from './BudgetVsActual.types';

const ROW_TYPE = {
  ACCOUNT: 'ACCOUNT',
  TOTAL: 'TOTAL',
};

export class BudgetVsActualTable extends flow(
  FinancialTable,
  FinancialSheetStructure,
)(FinancialSheet) {
  data: IBudgetVsActualReportData;
  query: IBudgetVsActualQuery;
  i18n: any;

  /**
   * Constructor method.
   * @param {IBudgetVsActualReportData} data - The report data.
   * @param {IBudgetVsActualQuery} query - The report query.
   * @param {I18nService} i18n - The i18n service.
   */
  constructor(
    data: IBudgetVsActualReportData,
    query: IBudgetVsActualQuery,
    i18n: I18nService,
  ) {
    super();

    this.data = data;
    this.query = query;
    this.i18n = i18n;
  }

  /**
   * Retrieves the table columns.
   * @returns {ITableColumn[]}
   */
  public tableColumns(): ITableColumn[] {
    const columns: ITableColumn[] = [
      {
        key: BUDGET_VS_ACTUAL_COLUMN_KEYS.ACCOUNT,
        label: this.i18n.t('budget_vs_actual.account_name'),
      },
    ];
    this.data.periods.forEach((period: IBudgetVsActualPeriod) => {
      columns.push({
        key: `${BUDGET_VS_ACTUAL_COLUMN_KEYS.BUDGET}_${period.key}`,
        label: `${period.label} - ${this.i18n.t('budget_vs_actual.budget')}`,
      });
      columns.push({
        key: `${BUDGET_VS_ACTUAL_COLUMN_KEYS.ACTUAL}_${period.key}`,
        label: `${period.label} - ${this.i18n.t('budget_vs_actual.actual')}`,
      });
    });
    columns.push(
      {
        key: BUDGET_VS_ACTUAL_COLUMN_KEYS.TOTAL_BUDGET,
        label: `${this.i18n.t('budget_vs_actual.total')} ${this.i18n.t(
          'budget_vs_actual.budget',
        )}`,
      },
      {
        key: BUDGET_VS_ACTUAL_COLUMN_KEYS.TOTAL_ACTUAL,
        label: `${this.i18n.t('budget_vs_actual.total')} ${this.i18n.t(
          'budget_vs_actual.actual',
        )}`,
      },
      {
        key: BUDGET_VS_ACTUAL_COLUMN_KEYS.VARIANCE,
        label: this.i18n.t('budget_vs_actual.variance'),
      },
      {
        key: BUDGET_VS_ACTUAL_COLUMN_KEYS.VARIANCE_PERCENTAGE,
        label: this.i18n.t('budget_vs_actual.variance_percentage'),
      },
    );
    return this.tableColumnsCellIndexing(columns);
  }

  /**
   * Retrieves the account row columns accessors.
   * @returns {IColumnMapperMeta[]}
   */
  private accountColumnsAccessors = (): IColumnMapperMeta[] => {
    const accessors: IColumnMapperMeta[] = [
      {
        key: BUDGET_VS_ACTUAL_COLUMN_KEYS.ACCOUNT,
        accessor: (row: IBudgetVsActualAccountRow) => row.accountName,
      },
    ];
    this.data.periods.forEach((period, index) => {
      accessors.push({
        key: `${BUDGET_VS_ACTUAL_COLUMN_KEYS.BUDGET}_${period.key}`,
        accessor: (row: IBudgetVsActualAccountRow) =>
          row.cells[index]?.formattedBudget ?? '',
      });
      accessors.push({
        key: `${BUDGET_VS_ACTUAL_COLUMN_KEYS.ACTUAL}_${period.key}`,
        accessor: (row: IBudgetVsActualAccountRow) =>
          row.cells[index]?.formattedActual ?? '',
      });
    });
    accessors.push(
      {
        key: BUDGET_VS_ACTUAL_COLUMN_KEYS.TOTAL_BUDGET,
        accessor: (row: IBudgetVsActualAccountRow) => row.total.formattedBudget,
      },
      {
        key: BUDGET_VS_ACTUAL_COLUMN_KEYS.TOTAL_ACTUAL,
        accessor: (row: IBudgetVsActualAccountRow) => row.total.formattedActual,
      },
      {
        key: BUDGET_VS_ACTUAL_COLUMN_KEYS.VARIANCE,
        accessor: (row: IBudgetVsActualAccountRow) =>
          row.total.formattedVariance,
      },
      {
        key: BUDGET_VS_ACTUAL_COLUMN_KEYS.VARIANCE_PERCENTAGE,
        accessor: (row: IBudgetVsActualAccountRow) =>
          row.total.formattedPercentage,
      },
    );
    return accessors;
  };

  /**
   * Retrieves the total row columns accessors.
   * @returns {IColumnMapperMeta[]}
   */
  private totalRowAccessors = (): IColumnMapperMeta[] => {
    const accessors: IColumnMapperMeta[] = [
      {
        key: BUDGET_VS_ACTUAL_COLUMN_KEYS.ACCOUNT,
        value: this.i18n.t('budget_vs_actual.total'),
      },
    ];
    this.data.periods.forEach((period, index) => {
      accessors.push({
        key: `${BUDGET_VS_ACTUAL_COLUMN_KEYS.BUDGET}_${period.key}`,
        accessor: () => this.data.totals.periods[index]?.formattedBudget ?? '',
      });
      accessors.push({
        key: `${BUDGET_VS_ACTUAL_COLUMN_KEYS.ACTUAL}_${period.key}`,
        accessor: () => this.data.totals.periods[index]?.formattedActual ?? '',
      });
    });
    accessors.push(
      {
        key: BUDGET_VS_ACTUAL_COLUMN_KEYS.TOTAL_BUDGET,
        accessor: () => this.data.totals.total.formattedBudget,
      },
      {
        key: BUDGET_VS_ACTUAL_COLUMN_KEYS.TOTAL_ACTUAL,
        accessor: () => this.data.totals.total.formattedActual,
      },
      {
        key: BUDGET_VS_ACTUAL_COLUMN_KEYS.VARIANCE,
        accessor: () => this.data.totals.total.formattedVariance,
      },
      {
        key: BUDGET_VS_ACTUAL_COLUMN_KEYS.VARIANCE_PERCENTAGE,
        accessor: () => this.data.totals.total.formattedPercentage,
      },
    );
    return accessors;
  };

  /**
   * Retrieves the table data rows.
   * @returns {ITableRow[]}
   */
  public tableData(): ITableRow[] {
    const accountRows = this.data.accounts.map((account) => {
      return tableRowMapper(account, this.accountColumnsAccessors(), {
        rowTypes: [ROW_TYPE.ACCOUNT],
      });
    });
    const totalRow = tableRowMapper(
      this.data.totals,
      this.totalRowAccessors(),
      {
        rowTypes: [ROW_TYPE.TOTAL],
      },
    );
    return [...accountRows, totalRow];
  }
}
