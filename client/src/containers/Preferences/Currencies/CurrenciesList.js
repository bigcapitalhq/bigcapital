import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Alert, Intent } from '@blueprintjs/core';
import { useQuery, queryCache } from 'react-query';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';

import CurrenciesDataTable from './CurrenciesDataTable';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';
import AppToaster from 'components/AppToaster';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withCurrenciesActions from 'containers/Currencies/withCurrenciesActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

function CurrenciesList({
  // #withCurrencies
  currenciesList,
  currenciesLoading,

  // #withCurrenciesActions
  requestDeleteCurrency,
  requestFetchCurrencies,

  // #withDialogActions
  openDialog,

  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  const [deleteCurrencyState, setDeleteCurrencyState] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const { formatMessage } = useIntl();

  const fetchCurrencies = useQuery(
    'currencies-table',
    () => requestFetchCurrencies(),
    { enabled: true },
  );

  useEffect(() => {
    changePreferencesPageTitle(formatMessage({ id: 'currencies' }));
  }, [changePreferencesPageTitle, formatMessage]);

  const handleEditCurrency = useCallback(() => {}, []);

  // Handle click and cancel/confirm currency delete
  const handleDeleteCurrency = useCallback((currency) => {
    setDeleteCurrencyState(currency);
  }, []);

  // handle cancel delete currency alert.
  const handleCancelCurrencyDelete = () => {
    setDeleteCurrencyState(false);
  };

  // Handle confirm Currency delete
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

  // Handle selected rows change.
  const handleSelectedRowsChange = useCallback(
    (accounts) => {
      setSelectedRows(accounts);
    },
    [setSelectedRows],
  );

  return (
    <DashboardInsider loading={fetchCurrencies.isFetching}>
      <DashboardPageContent>
        <CurrenciesDataTable
          onDeleteCurrency={handleDeleteCurrency}
          onEditCurrency={handleEditCurrency}
          onSelectedRowsChange={handleSelectedRowsChange}
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
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withDashboardActions,
  withCurrenciesActions,
  withDialogActions,
)(CurrenciesList);
