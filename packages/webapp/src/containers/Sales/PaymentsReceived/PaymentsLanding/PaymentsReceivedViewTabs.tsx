// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { FormattedMessage as T, DashboardViewsTabs } from '@/components';
import { pick } from 'lodash';

import withPaymentsReceived from './withPaymentsReceived';
import withPaymentsReceivedActions from './withPaymentsReceivedActions';
import { usePaymentsReceivedListContext } from './PaymentsReceivedListProvider';

import { compose } from '@/utils';

/**
 * Payment receive view tabs.
 */
function PaymentsReceivedViewTabs({
  // #withPaymentsReceivedActions
  addPaymentReceivesTableQueries,

  // #withPaymentsReceived
  paymentReceivesTableState,
}) {
  const history = useHistory();
  const { paymentReceivesViews, ...res } = usePaymentsReceivedListContext();

  const tabs = paymentReceivesViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  // Handles click a new view tab.
  const handleClickNewView = () => {
    history.push('/custom_views/payment-received/new');
  };

  // Handles the active tab chaing.
  const handleTabsChange = (customView) => {
    addPaymentReceivesTableQueries({
      customViewId: customView || null,
    });
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          customViewId={paymentReceivesTableState.customViewId}
          tabs={tabs}
          defaultTabText={<T id={'all_payments'} />}
          onNewViewTabClick={handleClickNewView}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(
  withPaymentsReceivedActions,
  withPaymentsReceived(({ paymentReceivesTableState }) => ({
    paymentReceivesTableState,
  })),
)(PaymentsReceivedViewTabs);
