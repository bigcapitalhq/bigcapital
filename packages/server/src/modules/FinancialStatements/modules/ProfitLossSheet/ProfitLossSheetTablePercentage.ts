// @ts-nocheck
import * as R from 'ramda';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';
import { I18nService } from 'nestjs-i18n';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';
import { ITableColumn, ITableColumnAccessor } from '../../types/Table.types';
import { PROFIT_LOSS_COLUMN_KEYS } from '../../common/constants/tableColumnKeys';

export const ProfitLossSheetTablePercentage = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class extends Base {
    i18n: I18nService;

    /**
     * @param {ProfitLossSheetQuery}
     */
    readonly query: ProfitLossSheetQuery;

    // ----------------------------------
    // # Columns.
    // ----------------------------------
    /**
     * Retrieve percentage of column/row columns.
     * @returns {ITableColumn[]}
     */
    protected percentageColumns = (): ITableColumn[] => {
      return R.pipe(
        R.when(
          this.query.isIncomePercentage,
          R.append({
            key: PROFIT_LOSS_COLUMN_KEYS.PERCENTAGE_OF_INCOME,
            label: this.i18n.t('profit_loss_sheet.percentage_of_income'),
          }),
        ),
        R.when(
          this.query.isExpensesPercentage,
          R.append({
            key: PROFIT_LOSS_COLUMN_KEYS.PERCENTAGE_OF_EXPENSES,
            label: this.i18n.t('profit_loss_sheet.percentage_of_expenses'),
          }),
        ),
        R.when(
          this.query.isColumnPercentage,
          R.append({
            key: PROFIT_LOSS_COLUMN_KEYS.PERCENTAGE_OF_COLUMN,
            label: this.i18n.t('profit_loss_sheet.percentage_of_column'),
          }),
        ),
        R.when(
          this.query.isRowPercentage,
          R.append({
            key: PROFIT_LOSS_COLUMN_KEYS.PERCENTAGE_OF_ROW,
            label: this.i18n.t('profit_loss_sheet.percentage_of_row'),
          }),
        ),
      )([]);
    };

    // ----------------------------------
    // # Accessors.
    // ----------------------------------
    /**
     * Retrieves percentage of column/row accessors.
     * @returns {ITableColumnAccessor[]}
     */
    protected percentageColumnsAccessor = (): ITableColumnAccessor[] => {
      return R.pipe(
        R.when(
          this.query.isIncomePercentage,
          R.append({
            key: PROFIT_LOSS_COLUMN_KEYS.PERCENTAGE_OF_INCOME,
            accessor: 'percentageIncome.formattedAmount',
          }),
        ),
        R.when(
          this.query.isExpensesPercentage,
          R.append({
            key: 'percentage_expense',
            accessor: 'percentageExpense.formattedAmount',
          }),
        ),
        R.when(
          this.query.isColumnPercentage,
          R.append({
            key: PROFIT_LOSS_COLUMN_KEYS.PERCENTAGE_OF_COLUMN,
            accessor: 'percentageColumn.formattedAmount',
          }),
        ),
        R.when(
          this.query.isRowPercentage,
          R.append({
            key: PROFIT_LOSS_COLUMN_KEYS.PERCENTAGE_OF_ROW,
            accessor: 'percentageRow.formattedAmount',
          }),
        ),
      )([]);
    };

    /**
     * Retrieves percentage horizontal columns accessors.
     * @param   {number} index
     * @returns {ITableColumn[]}
     */
    protected percetangeHorizontalColumnsAccessor = (
      index: number,
    ): ITableColumnAccessor[] => {
      return R.pipe(
        R.when(
          this.query.isIncomePercentage,
          R.append({
            key: `percentage_income-${index}`,
            accessor: `horizontalTotals[${index}].percentageIncome.formattedAmount`,
          }),
        ),
        R.when(
          this.query.isExpensesPercentage,
          R.append({
            key: `percentage_expense-${index}`,
            accessor: `horizontalTotals[${index}].percentageExpense.formattedAmount`,
          }),
        ),
        R.when(
          this.query.isColumnPercentage,
          R.append({
            key: `percentage_of_column-${index}`,
            accessor: `horizontalTotals[${index}].percentageColumn.formattedAmount`,
          }),
        ),
        R.when(
          this.query.isRowPercentage,
          R.append({
            key: `percentage_of_row-${index}`,
            accessor: `horizontalTotals[${index}].percentageRow.formattedAmount`,
          }),
        ),
      )([]);
    };
  };
