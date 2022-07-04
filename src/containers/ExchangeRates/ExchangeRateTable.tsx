import React, { useCallback } from 'react';

import { DataTable } from '@/components';
import TableSkeletonRows from '@/components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from '@/components/Datatable/TableHeaderSkeleton';

import { useExchangeRatesContext } from './ExchangeRatesProvider';
import { useExchangeRatesTableColumns, ActionMenuList } from './components';

import withExchangeRates from './withExchangeRates';
import withExchangeRatesActions from './withExchangeRatesActions';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertActions from 'containers/Alert/withAlertActions';
import { compose } from 'utils';

/**
 * Exchange rates table.
 */
function ExchangeRateTable({
  // #ownProps
  tableProps,

  // #withDialogActions.
  openDialog,

  // #withAlertActions
  openAlert,

  // #withExchangeRatesActions
  setExchangeRateTableState,

  // #withExchangeRates
  exchangeRatesTableState,
}) {
  const {
    isExchangeRatesFetching,
    isExchangeRatesLoading,

    exchangesRates,
    pagination,
  } = useExchangeRatesContext();

  // Table columns.
  const columns = useExchangeRatesTableColumns();

  // Handle delete exchange rate.
  const handleDeleteExchangeRate = ({ id }) => {
    openAlert('exchange-rate-delete', { exchangeRateId: id });
  };

  // Handle Edit exchange rate.
  const handelEditExchangeRate = (exchangeRate) => {
    openDialog('exchangeRate-form', {
      action: 'edit',
      exchangeRate: exchangeRate,
    });
  };

  const handleFetchData = useCallback(
    ({ pageSize, pageIndex, sortBy }) => {
      setExchangeRateTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setExchangeRateTableState],
  );

  return (
    <DataTable
      noInitialFetch={true}
      columns={columns}
      data={exchangesRates}
      initialState={exchangeRatesTableState}
      loading={isExchangeRatesLoading}
      headerLoading={isExchangeRatesLoading}
      progressBarLoading={isExchangeRatesFetching}
      selectionColumn={true}
      expandable={true}
      sticky={true}
      manualSortBy={true}
      onFetchData={handleFetchData}
      pagination={true}
      manualPagination={true}
      pagesCount={pagination.pagesCount}
      TableLoadingRenderer={TableSkeletonRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      ContextMenu={ActionMenuList}
      payload={{
        onDeleteExchangeRate: handleDeleteExchangeRate,
        onEditExchangeRate: handelEditExchangeRate,
      }}
      {...tableProps}
    />
  );
}

export default compose(
  withDialogActions,
  withAlertActions,
  withExchangeRates(({ exchangeRatesTableState }) => ({
    exchangeRatesTableState,
  })),
  withExchangeRatesActions,
)(ExchangeRateTable);
