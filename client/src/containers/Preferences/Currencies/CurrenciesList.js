import React, { useCallback, useState, useEffect } from 'react';
import { Alert, Intent } from '@blueprintjs/core';
import { useQuery } from 'react-query';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';

import CurrenciesDataTable from './CurrenciesDataTable';
import AppToaster from 'components/AppToaster';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withCurrenciesActions from 'containers/Currencies/withCurrenciesActions';

import { compose } from 'utils';

// Currencies landing list page.
function CurrenciesList({
  // #withCurrenciesActions
  requestDeleteCurrency,
  requestFetchCurrencies,

  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  const [deleteCurrencyState, setDeleteCurrencyState] = useState(false);
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
  }, [setDeleteCurrencyState]);

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
              id: 'the_currency_has_been_deleted_successfully',
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

  return (
    <>
      <CurrenciesDataTable
        onDeleteCurrency={handleDeleteCurrency}
        onEditCurrency={handleEditCurrency}
      />
      <Alert
        cancelButtonText={<T id={'cancel'} />}
        confirmButtonText={<T id={'delete'} />}
        intent={Intent.DANGER}
        isOpen={deleteCurrencyState}
        onCancel={handleCancelCurrencyDelete}
        onConfirm={handleConfirmCurrencyDelete}
      >
        <p>
          Once you delete this currency, you won't be able to restore it later. Are you sure you want to delete ?
        </p>
      </Alert>
    </>
  );
}

export default compose(
  withDashboardActions,
  withCurrenciesActions,
)(CurrenciesList);
