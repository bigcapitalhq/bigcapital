import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';

import PaymentMadeForm from './PaymentMadeForm';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withVenderActions from 'containers/Vendors/withVendorActions';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withItemsActions from 'containers/Items/withItemsActions';
import withPaymentMadeActions from './withPaymentMadeActions';
import withBillActions from '../Bill/withBillActions';
import withSettingsActions from 'containers/Settings/withSettingsActions';

import { compose } from 'utils';

import 'style/pages/PaymentMade/PageForm.scss'

/**
 * Payment made - Page form.
 */
function PaymentMadeFormPage({
  //#withAccountsActions
  requestFetchAccounts,

  //#withVenderActions
  requestFetchVendorsTable,

  //#withItemsActions
  requestFetchItems,

  //#withPaymentMadesActions
  requestFetchPaymentMade,

  // #withSettingsActions
  requestFetchOptions,

  // #withDashboardActions
  changePageTitle,
  setSidebarShrink,
  resetSidebarPreviousExpand,
  setDashboardBackLink
}) {
  const { id: paymentMadeId } = useParams();
  const { formatMessage } = useIntl();

  useEffect(() => {
    // Shrink the sidebar by foce.
    setSidebarShrink();
    // Show the back link on dashboard topbar.
    setDashboardBackLink(true);

    return () => {
      // Reset the sidebar to the previous status.
      resetSidebarPreviousExpand();
      // Hide the back link on dashboard topbar.
      setDashboardBackLink(false);
    };
  }, [resetSidebarPreviousExpand, setSidebarShrink, setDashboardBackLink]);

  // Handle page title change in new and edit mode.
  useEffect(() => {
    if (paymentMadeId) {
      changePageTitle(formatMessage({ id: 'edit_payment_made' }));
    } else {
      changePageTitle(formatMessage({ id: 'payment_made' }));
    }
  }, [changePageTitle, paymentMadeId, formatMessage]);

  // Handle fetch accounts data.
  const fetchAccounts = useQuery('accounts-list', (key) =>
    requestFetchAccounts(),
  );

  // Handle fetch Items data table or list.
  const fetchItems = useQuery('items-list', () => requestFetchItems({}));

  // Handle fetch venders data table or list.
  const fetchVenders = useQuery('venders-list', () =>
    requestFetchVendorsTable({}),
  );

  // Handle fetch specific payment made details.
  const fetchPaymentMade = useQuery(
    ['payment-made', paymentMadeId],
    (key, _id) => requestFetchPaymentMade(_id),
    { enabled: !!paymentMadeId },
  );

  // Fetch payment made settings.
  const fetchSettings = useQuery(['settings'], () => requestFetchOptions({}));
 
  return (
    <DashboardInsider
      loading={
        fetchVenders.isFetching ||
        fetchItems.isFetching ||
        fetchAccounts.isFetching ||
        fetchPaymentMade.isFetching ||
        fetchSettings.isFetching
      }
      name={'payment-made'}
    >
      <PaymentMadeForm
        paymentMadeId={paymentMadeId}
        mode={paymentMadeId ? 'edit' : 'new'}
      /> 
    </DashboardInsider>
  );
}

export default compose(
  withVenderActions,
  withItemsActions,
  withAccountsActions,
  withBillActions,
  withPaymentMadeActions,
  withSettingsActions,
  withDashboardActions,
)(PaymentMadeFormPage);

