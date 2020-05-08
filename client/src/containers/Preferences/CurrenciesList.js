import React, { useEffect, useCallback, useState, useMemo } from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Classes,
  Tooltip,
  Alert,
  Intent,
} from '@blueprintjs/core';
import Icon from 'components/Icon';
import { snakeCase } from 'lodash';
import { compose } from 'utils';
import CurrencyFromDialogConnect from 'connectors/CurrencyFromDialog.connect';
import DialogConnect from 'connectors/Dialog.connector';
import DashboardConnect from 'connectors/Dashboard.connector';
import LoadingIndicator from 'components/LoadingIndicator';
import DataTable from 'components/DataTable';
import AppToaster from 'components/AppToaster';

function CurrenciesList({
  currencies,
  openDialog,
  onFetchData,
  requestDeleteCurrency,
}) {
  const [deleteCurrencyState, setDeleteCurrencyState] = useState(false);

  const handleEditCurrency = (currency) => () => {
    openDialog('currency-form', {
      action: 'edit',
      currency_code: currency.currency_code,
    });
  };

  const onDeleteCurrency = (currency) => {
    setDeleteCurrencyState(currency);
  };
  const handleCancelCurrencyDelete = () => {
    setDeleteCurrencyState(false);
  };

  const handleConfirmCurrencyDelete = useCallback(() => {
    requestDeleteCurrency(deleteCurrencyState.currency_code).then(
      (response) => {
        setDeleteCurrencyState(false);
        AppToaster.show({
          message: 'the_Currency_has_been_deleted',
        });
      }
    );
  }, [deleteCurrencyState]);

  const actionMenuList = useCallback(
    (currency) => (
      <Menu>
        <MenuItem text='Edit Currency' onClick={handleEditCurrency(currency)} />

        <MenuItem
          text='Delete Currency'
          onClick={() => onDeleteCurrency(currency)}
        />
      </Menu>
    ),
    []
  );

  const columns = useMemo(
    () => [
      {
        id: 'currency_name',
        Header: 'Currency Name',
        accessor: 'currency_name',
        width: 100,
      },
      {
        id: 'currency_code',
        Header: 'Currency Code',
        accessor: 'currency_code',
        className: 'currency_code',
        width: 100,
      },
      {
        Header: 'Currency sign',
        width: 50,
      },
      {
        id: 'actions',
        Header: '',
        Cell: ({ cell }) => (
          <Popover
            content={actionMenuList(cell.row.original)}
            position={Position.RIGHT_TOP}
          >
            <Button icon={<Icon icon='ellipsis-h' />} />
          </Popover>
        ),
        className: 'actions',
        width: 50,
      },
    ],
    [actionMenuList]
  );
  const handleDatatableFetchData = useCallback(() => {
    onFetchData && onFetchData();
  }, []);

  return (
    <LoadingIndicator>
      <DataTable
        columns={columns}
        data={Object.values(currencies)}
        onFetchData={handleDatatableFetchData()}
        selectionColumn={true}
      />

      <Alert
        cancelButtonText='Cancel'
        confirmButtonText='Move to Trash'
        icon='trash'
        intent={Intent.DANGER}
        isOpen={deleteCurrencyState}
        onCancel={handleCancelCurrencyDelete}
        onConfirm={handleConfirmCurrencyDelete}
      >
        <p>
          Are you sure you want to move <b>filename</b> to Trash? You will be
          able to restore it later, but it will become private to you.
        </p>
      </Alert>
    </LoadingIndicator>
  );
}

export default compose(
  CurrencyFromDialogConnect,
  DialogConnect,
  DashboardConnect
)(CurrenciesList);
