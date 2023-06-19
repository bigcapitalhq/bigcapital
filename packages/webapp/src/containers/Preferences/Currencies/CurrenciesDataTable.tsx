// @ts-nocheck
import React, { useCallback } from 'react';
import { compose } from '@/utils';

import { DataTable, TableSkeletonRows } from '@/components';

import { useCurrenciesContext } from './CurrenciesProvider';

import { ActionMenuList, useCurrenciesTableColumns } from './components';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withAlertActions from '@/containers/Alert/withAlertActions';
import styled from 'styled-components';

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
    <CurrenciesDataTable
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

const CurrenciesDataTable = styled(DataTable)`
  .table .th,
  .table .td {
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
  }
`;
