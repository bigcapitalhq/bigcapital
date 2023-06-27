// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { FormattedMessage as T, DashboardViewsTabs } from '@/components';
import { pick } from 'lodash';

import withPaymentReceives from './withPaymentReceives';
import withPaymentReceivesActions from './withPaymentReceivesActions';
import { usePaymentReceivesListContext } from './PaymentReceiptsListProvider';

import { compose } from '@/utils';

/**
 * Payment receive view tabs.
 */
function PaymentReceiveViewTabs({
  // #withPaymentReceivesActions
  addPaymentReceivesTableQueries,

  // #withPaymentReceives
  paymentReceivesTableState,
}) {
  const history = useHistory();
  const { paymentReceivesViews, ...res } = usePaymentReceivesListContext();

  const tabs = paymentReceivesViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  // Handles click a new view tab.
  const handleClickNewView = () => {
    history.push('/custom_views/payment-receives/new');
  };

  // Handles the active tab change.
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
  withPaymentReceivesActions,
  withPaymentReceives(({ paymentReceivesTableState }) => ({
    paymentReceivesTableState,
  })),
)(PaymentReceiveViewTabs);
