// @ts-nocheck
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { pick } from 'lodash';
import React from 'react';
import { useHistory } from 'react-router';
import { usePaymentsReceivedListContext } from './PaymentsReceivedListProvider';
import { withPaymentsReceived } from './withPaymentsReceived';
import { withPaymentsReceivedActions } from './withPaymentsReceivedActions';
import { FormattedMessage as T, DashboardViewsTabs } from '@/components';
import { compose } from '@/utils';

/**
 * Payment receive view tabs.
 */
function PaymentsReceivedViewTabsInner({
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

export const PaymentsReceivedViewTabs = compose(
  withPaymentsReceivedActions,
  withPaymentsReceived(({ paymentReceivesTableState }) => ({
    paymentReceivesTableState,
  })),
)(PaymentsReceivedViewTabsInner);
