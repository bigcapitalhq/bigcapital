import React, { useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import Money from 'components/Money';

import { compose, defaultExpanderReducer } from 'utils';
import {
  getFinancialSheetIndexByQuery,
} from 'store/financialStatement/financialStatements.selectors';
import withProfitLossDetail from './withProfitLoss';
import { FormattedMessage as T, useIntl } from 'react-intl';


function ProfitLossSheetTable({
  // #withProfitLoss
  profitLossTableRows,
  profitLossQuery,
  profitLossColumns,

  // #ownProps
  loading,
  onFetchData,
  companyName,
}) {

  const {formatMessage} =useIntl();

  const columns = useMemo(() => [
    {
      // Build our expander column
      id: 'expander', // Make sure it has an ID
      className: 'expander',
      Header: ({
        getToggleAllRowsExpandedProps,
        isAllRowsExpanded
      }) => (
        <span {...getToggleAllRowsExpandedProps()} className="toggle">
          {isAllRowsExpanded ?
            (<span class="arrow-down" />) :
            (<span class="arrow-right" />)
          }
        </span>
      ),
      Cell: ({ row }) =>
        // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
        // to build the toggle for expanding a row
        row.canExpand ? (
          <span
            {...row.getToggleRowExpandedProps({
              style: {
                // We can even use the row.depth property
                // and paddingLeft to indicate the depth
                // of the row
                paddingLeft: `${row.depth * 2}rem`,
              },
              className: 'toggle',
            })}
          >
            {row.isExpanded ?
              (<span class="arrow-down" />) :
              (<span class="arrow-right" />)
            }
          </span>
        ) : null,
      width: 20,
      disableResizing: true,
    },  
    {
      Header: formatMessage({id:'account_name'}),
      accessor: 'name',
      className: "name",
    },
    {
      Header: formatMessage({id:'acc_code'}),
      accessor: 'code',
      className: "account_code",
    },
    ...(profitLossQuery.display_columns_type === 'total') ? [
      {
        Header: formatMessage({id:'total'}),
        Cell: ({ cell }) => {
          const row = cell.row.original;
          if (row.total) {
            return (<Money amount={row.total.formatted_amount} currency={'USD'} />);
          }
          return '';          
        },
        className: "total",
      }
    ] : [],
    ...(profitLossQuery.display_columns_type === 'date_periods') ? 
      (profitLossColumns.map((column, index) => ({
        id: `date_period_${index}`,
        Header: column,
        accessor: (row) => {
          if (row.periods && row.periods[index]) {
            const amount = row.periods[index].formatted_amount;
            return (<Money amount={amount} currency={'USD'} />);
          }
          return '';
        },
        width: 100,
      })))
    : [],
  ], [profitLossQuery.display_columns_type, profitLossColumns]);

  // Handle data table fetch data.
  const handleFetchData = useCallback((...args) => {
    onFetchData && onFetchData(...args);
  }, [onFetchData]);

  // Retrieve default expanded rows of balance sheet.
  const expandedRows = useMemo(() => 
    defaultExpanderReducer(profitLossTableRows, 1),
    [profitLossTableRows]);

  // Retrieve conditional datatable row classnames.
  const rowClassNames = useCallback((row) => {
    return {
      [`row--${row.rowType}`]: row.rowType,
    };
  }, []);

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={'Profit/Loss Sheet'}
      date={new Date()}
      name="profit-loss-sheet"
      loading={loading}
      basis={profitLossQuery.basis}>

      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={profitLossTableRows}
        onFetchData={handleFetchData}
        expanded={expandedRows}
        rowClassNames={rowClassNames}
        noInitialFetch={true} />
    </FinancialSheet>
  );
}

const mapStateToProps = (state, props) => ({
  profitLossIndex: getFinancialSheetIndexByQuery(
    state.financialStatements.profitLoss.sheets,
    props.profitLossQuery,
  ),
});

const withProfitLossTable = connect(mapStateToProps);

export default compose(
  withProfitLossTable,
  withProfitLossDetail(({ profitLossQuery, profitLossColumns, profitLossTableRows }) => ({
    profitLossColumns,
    profitLossQuery,
    profitLossTableRows,
  })),
)(ProfitLossSheetTable);