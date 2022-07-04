import React, { useCallback } from 'react';
import { compose } from 'utils';

import { DataTable } from '@/components';

import { useCurrenciesContext } from './CurrenciesProvider';
import TableSkeletonRows from '@/components/Datatable/TableSkeletonRows';

import { ActionMenuList, useCurrenciesTableColumns } from './components';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertActions from 'containers/Alert/withAlertActions';

/**
 * Currencies table.
 */
function CurrenciesDataTable({
  // #ownProps
  tableProps,

  // #withDialog.
  openDialog,

  // #withAlertActions
  openAlert,
}) {
  const { currencies, isCurrenciesLoading } = useCurrenciesContext();

  // Table columns.
  const columns = useCurrenciesTableColumns();

  // Handle Edit Currency.
  const handleEditCurrency = useCallback(
    (currency) => {
      openDialog('currency-form', {
        action: 'edit',
        currency: currency,
      });
    },
    [openDialog],
  );

  // Handle delete currency.
  const handleDeleteCurrency = ({ currency_code }) => {
    openAlert('currency-delete', { currency_code: currency_code });
  };
  
  return (
    <DataTable
      columns={columns}
      data={currencies}
      loading={isCurrenciesLoading}
      progressBarLoading={isCurrenciesLoading}
      TableLoadingRenderer={TableSkeletonRows}
      ContextMenu={ActionMenuList}
      noInitialFetch={true}
      payload={{
        onDeleteCurrency: handleDeleteCurrency,
        onEditCurrency: handleEditCurrency,
      }}
      rowContextMenu={ActionMenuList}
      {...tableProps}
    />
  );
}

export default compose(
  withDialogActions,
  withAlertActions,
)(CurrenciesDataTable);
