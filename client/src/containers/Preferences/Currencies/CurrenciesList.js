import React, { useCallback, useState, useMemo, useEffect } from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  Position,
  Alert,
  Intent,
} from '@blueprintjs/core';
import { useQuery, queryCache } from 'react-query';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';

import Icon from 'components/Icon';
import LoadingIndicator from 'components/LoadingIndicator';
import DataTable from 'components/DataTable';
import AppToaster from 'components/AppToaster';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withCurrencies from 'containers/Currencies/withCurrencies';
import withCurrenciesActions from 'containers/Currencies/withCurrenciesActions';
import DialogConnect from 'connectors/Dialog.connector';

import { compose } from 'utils';

function CurrenciesList({
  // #withCurrencies
  currenciesList,
  currenciesLoading,

  // #withCurrenciesActions
  requestDeleteCurrency,
  requestFetchCurrencies,

  // #withDialog
  openDialog,

  // #withDashboardActions
  changePreferencesPageTitle,

  // #ownProps
  onFetchData,
}) {
  const [deleteCurrencyState, setDeleteCurrencyState] = useState(false);
  const { formatMessage } = useIntl();

  const fetchCurrencies = useQuery('currencies-table',
    () => requestFetchCurrencies(),
    { manual: true },
  );

  useEffect(() => {
    changePreferencesPageTitle(formatMessage({ id: 'currencies' }));
  }, [changePreferencesPageTitle, formatMessage]);

  const handleEditCurrency = useCallback(
    (currency) => {
      openDialog('currency-form', {
        action: 'edit',
        currencyCode: currency.currency_code,
      });
    },
    [openDialog],
  );

  const onDeleteCurrency = useCallback((currency) => {
    setDeleteCurrencyState(currency);
  }, []);
  const handleCancelCurrencyDelete = () => {
    setDeleteCurrencyState(false);
  };

  const handleConfirmCurrencyDelete = useCallback(
    (refetch) => {
      requestDeleteCurrency(deleteCurrencyState.currency_code)
        .then((response) => {
          setDeleteCurrencyState(false);
          AppToaster.show({
            message: formatMessage({
              id: 'the_currency_has_been_successfully_deleted',
            }),
            intent: Intent.SUCCESS,
          });
        })
        .catch((errors) => {
          setDeleteCurrencyState(false);
        });
    },
    [deleteCurrencyState, requestDeleteCurrency, formatMessage],
  );

  const actionMenuList = useCallback(
    (currency) => (
      <Menu>
        <MenuItem
          text={<T id={'edit_currency'} />}
          onClick={() => handleEditCurrency(currency)}
        />

        <MenuItem
          text={<T id={'delete_currency'} />}
          onClick={() => onDeleteCurrency(currency)}
          intent={Intent.DANGER}
        />
      </Menu>
    ),
    [handleEditCurrency, onDeleteCurrency],
  );

  const columns = useMemo(
    () => [
      {
        Header: formatMessage({ id: 'currency_name' }),
        accessor: 'currency_name',
        width: 150,
      },
      {
        Header: formatMessage({ id: 'currency_code' }),
        accessor: 'currency_code',
        className: 'currency_code',
        width: 120,
      },
      {
        Header: 'Currency sign',
        width: 120,
      },
      {
        id: 'actions',
        Header: '',
        Cell: ({ cell }) => (
          <Popover
            content={actionMenuList(cell.row.original)}
            position={Position.RIGHT_TOP}
          >
            <Button icon={<Icon icon="ellipsis-h" />} />
          </Popover>
        ),
        className: 'actions',
        width: 50,
      },
    ],
    [actionMenuList, formatMessage],
  );

  const handleDataTableFetchData = useCallback(() => {
    fetchCurrencies.refetch();
  }, [fetchCurrencies]);

  return (
    <LoadingIndicator loading={fetchCurrencies.isFetching}>
      <DataTable
        columns={columns}
        data={currenciesList}
        onFetchData={handleDataTableFetchData}
        loading={currenciesLoading}
      />
      <Alert
        cancelButtonText={<T id={'cancel'} />}
        confirmButtonText={<T id={'delete'} />}
        icon="trash"
        intent={Intent.DANGER}
        isOpen={deleteCurrencyState}
        onCancel={handleCancelCurrencyDelete}
        onConfirm={handleConfirmCurrencyDelete}
      >
        <p>
          <FormattedHTMLMessage
            id={'once_delete_this_currency_you_will_able_to_restore_it'}
          />
        </p>
      </Alert>
    </LoadingIndicator>
  );
}

export default compose(
  DialogConnect,
  withDashboardActions,
  withCurrencies(({ currenciesList }) => ({
    currenciesList,
  })),
  withCurrenciesActions,
)(CurrenciesList);
