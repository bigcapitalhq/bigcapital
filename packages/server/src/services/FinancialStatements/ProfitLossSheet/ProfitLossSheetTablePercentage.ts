import * as R from 'ramda';
import { ITableColumn, ITableColumnAccessor } from '@/interfaces';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';

export const ProfitLossSheetTablePercentage = (Base) =>
  class extends Base {
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
            key: 'percentage_income',
            label: this.i18n.__('profit_loss_sheet.percentage_of_income'),
          })
        ),
        R.when(
          this.query.isExpensesPercentage,
          R.append({
            key: 'percentage_expenses',
            label: this.i18n.__('profit_loss_sheet.percentage_of_expenses'),
          })
        ),
        R.when(
          this.query.isColumnPercentage,
          R.append({
            key: 'percentage_column',
            label: this.i18n.__('profit_loss_sheet.percentage_of_column'),
          })
        ),
        R.when(
          this.query.isRowPercentage,
          R.append({
            key: 'percentage_row',
            label: this.i18n.__('profit_loss_sheet.percentage_of_row'),
          })
        )
      )([]);
    };

    // ----------------------------------
    // # Accessors.
    // ----------------------------------
    /**
     * Retrieves percentage of column/row accessors.
     * @returns {ITableColumn[]}
     */
    protected percentageColumnsAccessor = (): ITableColumnAccessor[] => {
      return R.pipe(
        R.when(
          this.query.isIncomePercentage,
          R.append({
            key: 'percentage_income',
            accessor: 'percentageIncome.formattedAmount',
          })
        ),
        R.when(
          this.query.isExpensesPercentage,
          R.append({
            key: 'percentage_expense',
            accessor: 'percentageExpense.formattedAmount',
          })
        ),
        R.when(
          this.query.isColumnPercentage,
          R.append({
            key: 'percentage_column',
            accessor: 'percentageColumn.formattedAmount',
          })
        ),
        R.when(
          this.query.isRowPercentage,
          R.append({
            key: 'percentage_row',
            accessor: 'percentageRow.formattedAmount',
          })
        )
      )([]);
    };

    /**
     * Retrieves percentage horizontal columns accessors.
     * @param   {number} index
     * @returns {ITableColumn[]}
     */
    protected percentageHorizontalColumnsAccessor = (
      index: number
    ): ITableColumnAccessor[] => {
      return R.pipe(
        R.when(
          this.query.isIncomePercentage,
          R.append({
            key: `percentage_income-${index}`,
            accessor: `horizontalTotals[${index}].percentageIncome.formattedAmount`,
          })
        ),
        R.when(
          this.query.isExpensesPercentage,
          R.append({
            key: `percentage_expense-${index}`,
            accessor: `horizontalTotals[${index}].percentageExpense.formattedAmount`,
          })
        ),
        R.when(
          this.query.isColumnPercentage,
          R.append({
            key: `percentage_of_column-${index}`,
            accessor: `horizontalTotals[${index}].percentageColumn.formattedAmount`,
          })
        ),
        R.when(
          this.query.isRowPercentage,
          R.append({
            key: `percentage_of_row-${index}`,
            accessor: `horizontalTotals[${index}].percentageRow.formattedAmount`,
          })
        )
      )([]);
    };
  };
