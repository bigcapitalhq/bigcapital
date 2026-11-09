import { flow } from 'fp-ts/function';
import { when } from '@/common/fp';
import { I18nService } from 'nestjs-i18n';
import { ITableColumn, ITableColumnAccessor } from '../../types/Table.types';
import { GConstructor } from '@/common/types/Constructor';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { FinancialSheet } from '../../common/FinancialSheet';
import { BALANCE_SHEET_COLUMN_KEYS } from '../../common/constants/tableColumnKeys';

export const BalanceSheetTablePercentage = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class BalanceSheetComparsionPreviousYear extends Base {
    public readonly query: BalanceSheetQuery;
    public readonly i18n: I18nService;

    // --------------------
    // # Columns
    // --------------------
    /**
     * Retrieve percentage of column/row columns.
     * @returns {ITableColumn[]}
     */
    public percentageColumns = (): ITableColumn[] => {
      return flow(
        when(
          this.query.isColumnsPercentageActive,
          (columns: ITableColumn[]) => [
            ...columns,
            {
              key: BALANCE_SHEET_COLUMN_KEYS.PERCENTAGE_OF_COLUMN,
              label: this.i18n.t('balance_sheet.percentage_of_column'),
            },
          ],
        ),
        when(this.query.isRowsPercentageActive, (columns: ITableColumn[]) => [
          ...columns,
          {
            key: BALANCE_SHEET_COLUMN_KEYS.PERCENTAGE_OF_ROW,
            label: this.i18n.t('balance_sheet.percentage_of_row'),
          },
        ]),
      )([]);
    };

    // --------------------
    // # Accessors
    // --------------------
    /**
     * Retrieves percentage of column/row accessors.
     * @returns {ITableColumn[]}
     */
    public percentageColumnsAccessor = (): ITableColumnAccessor[] => {
      return flow(
        when(
          this.query.isColumnsPercentageActive,
          (accessors: ITableColumnAccessor[]) => [
            ...accessors,
            {
              key: BALANCE_SHEET_COLUMN_KEYS.PERCENTAGE_OF_COLUMN,
              accessor: 'percentageColumn.formattedAmount',
            },
          ],
        ),
        when(
          this.query.isRowsPercentageActive,
          (accessors: ITableColumnAccessor[]) => [
            ...accessors,
            {
              key: BALANCE_SHEET_COLUMN_KEYS.PERCENTAGE_OF_ROW,
              accessor: 'percentageRow.formattedAmount',
            },
          ],
        ),
      )([]);
    };

    /**
     * Percentage columns accessors for date period columns.
     * @param   {number} index
     * @returns {ITableColumn[]}
     */
    public percetangeDatePeriodColumnsAccessor = (
      index: number,
    ): ITableColumnAccessor[] => {
      return flow(
        when(
          this.query.isColumnsPercentageActive,
          (accessors: ITableColumnAccessor[]) => [
            ...accessors,
            {
              key: `percentage_of_column-${index}`,
              accessor: `horizontalTotals[${index}].percentageColumn.formattedAmount`,
            },
          ],
        ),
        when(
          this.query.isRowsPercentageActive,
          (accessors: ITableColumnAccessor[]) => [
            ...accessors,
            {
              key: `percentage_of_row-${index}`,
              accessor: `horizontalTotals[${index}].percentageRow.formattedAmount`,
            },
          ],
        ),
      )([]);
    };
  };
