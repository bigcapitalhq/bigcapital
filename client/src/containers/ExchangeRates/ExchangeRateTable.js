import React from 'react';

import { DataTable } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';

import { useExchangeRatesContext } from './ExchangeRatesProvider';
import { useExchangeRatesTableColumns, ActionMenuList } from './components';

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

  return (
    <DataTable
      columns={columns}
      data={exchangesRates}
      noInitialFetch={true}
      loading={isExchangeRatesLoading}
      headerLoading={isExchangeRatesLoading}
      progressBarLoading={isExchangeRatesFetching}
      selectionColumn={true}
      manualSortBy={true}
      expandable={true}
      sticky={true}
      // pagination={true}
      TableLoadingRenderer={TableSkeletonRows}
      payload={{
        onDeleteExchangeRate: handleDeleteExchangeRate,
        onEditExchangeRate: handelEditExchangeRate,
      }}
      ContextMenu={ActionMenuList}
      {...tableProps}
    />
  );
}

export default compose(withDialogActions, withAlertActions)(ExchangeRateTable);
