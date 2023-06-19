import * as R from 'ramda';
import { ITableColumn } from '@/interfaces';

export const BalanceSheetTablePercentage = (Base) =>
  class extends Base {
    // --------------------
    // # Columns
    // --------------------
    /**
     * Retrieve percentage of column/row columns.
     * @returns {ITableColumn[]}
     */
    protected percentageColumns = (): ITableColumn[] => {
      return R.pipe(
        R.when(
          this.query.isColumnsPercentageActive,
          R.append({
            key: 'percentage_of_column',
            label: this.i18n.__('balance_sheet.percentage_of_column'),
          })
        ),
        R.when(
          this.query.isRowsPercentageActive,
          R.append({
            key: 'percentage_of_row',
            label: this.i18n.__('balance_sheet.percentage_of_row'),
          })
        )
      )([]);
    };

    // --------------------
    // # Accessors
    // --------------------
    /**
     * Retrieves percentage of column/row accessors.
     * @returns {ITableColumn[]}
     */
    protected percentageColumnsAccessor = (): ITableColumn[] => {
      return R.pipe(
        R.when(
          this.query.isColumnsPercentageActive,
          R.append({
            key: 'percentage_of_column',
            accessor: 'percentageColumn.formattedAmount',
          })
        ),
        R.when(
          this.query.isRowsPercentageActive,
          R.append({
            key: 'percentage_of_row',
            accessor: 'percentageRow.formattedAmount',
          })
        )
      )([]);
    };

    /**
     * Percentage columns accessors for date period columns.
     * @param   {number} index
     * @returns {ITableColumn[]}
     */
    protected percentageDatePeriodColumnsAccessor = (
      index: number
    ): ITableColumn[] => {
      return R.pipe(
        R.when(
          this.query.isColumnsPercentageActive,
          R.append({
            key: `percentage_of_column-${index}`,
            accessor: `horizontalTotals[${index}].percentageColumn.formattedAmount`,
          })
        ),
        R.when(
          this.query.isRowsPercentageActive,
          R.append({
            key: `percentage_of_row-${index}`,
            accessor: `horizontalTotals[${index}].percentageRow.formattedAmount`,
          })
        )
      )([]);
    };
  };
