import React, { useCallback } from 'react';
import styled from 'styled-components';
import { ActionMenuList, useCurrenciesTableColumns } from './components';
import { useCurrenciesContext } from './CurrenciesProvider';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { Currency } from '@bigcapital/sdk-ts';
import { DataTable, TableSkeletonRows } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

type CurrenciesDataTableInnerProps = Pick<
  WithDialogActionsProps,
  'openDialog'
> &
  Pick<WithAlertActionsProps, 'openAlert'> & {
    tableProps?: Record<string, unknown>;
  };

/**
 * Currencies table.
 */
function CurrenciesDataTableInner({
  // #ownProps
  tableProps,

  // #withDialog.
  openDialog,

  // #withAlertActions
  openAlert,
}: CurrenciesDataTableInnerProps) {
  const { currencies, isCurrenciesLoading } = useCurrenciesContext();

  // Table columns.
  const columns = useCurrenciesTableColumns();

  // Handle Edit Currency.
  const handleEditCurrency = useCallback(
    (currency: Currency) => {
      openDialog('currency-form', {
        action: 'edit',
        currency: currency,
      });
    },
    [openDialog],
  );

  // Handle delete currency.
  const handleDeleteCurrency = (currency: Currency) => {
    openAlert('currency-delete', { currency_code: currency.currencyCode });
  };

  return (
    <CurrencieDataTable
      columns={columns}
      data={currencies ?? []}
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

export const CurrenciesDataTable = compose(
  withDialogActions,
  withAlertActions,
)(CurrenciesDataTableInner);

const CurrencieDataTable = styled(DataTable)`
  .table .th,
  .table .td {
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
  }
`;
