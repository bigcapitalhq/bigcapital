import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { usePaymentsReceivedListContext } from './PaymentsReceivedListProvider';
import { withPaymentsReceived } from './withPaymentsReceived';
import { withPaymentsReceivedActions } from './withPaymentsReceivedActions';
import type { WithPaymentsReceivedProps } from './withPaymentsReceived';
import type { WithPaymentsReceivedActionsProps } from './withPaymentsReceivedActions';
import { FormattedMessage as T, DashboardViewsTabs } from '@/components';
import { transfromViewsToTabs } from '@/utils';

interface PaymentsReceivedViewTabsProps
  extends WithPaymentsReceivedActionsProps,
    Pick<WithPaymentsReceivedProps, 'paymentReceivesTableState'> {}

/**
 * Payment receive view tabs.
 */
function PaymentsReceivedViewTabsInner({
  // #withPaymentsReceivedActions
  setPaymentReceivesTableState,

  // #withPaymentsReceived
  paymentReceivesTableState,
}: PaymentsReceivedViewTabsProps) {
  const history = useHistory();
  const { paymentReceivesViews } = usePaymentsReceivedListContext();

  const tabs = transfromViewsToTabs(paymentReceivesViews);

  // Handles click a new view tab.
  const handleClickNewView = () => {
    history.push('/custom_views/payment-received/new');
  };

  // Handles the active tab chaing.
  const handleTabsChange = (customView: number | null) => {
    setPaymentReceivesTableState({
      customViewId: customView || null,
    });
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewSlug={paymentReceivesTableState.customViewId}
          resourceName={'payment-received'}
          tabs={tabs}
          defaultTabText={<T id={'all_payments'} />}
          onNewViewTabClick={handleClickNewView}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export const PaymentsReceivedViewTabs = FF.pipe(
  PaymentsReceivedViewTabsInner,
  withPaymentsReceived(({ paymentReceivesTableState }) => ({
    paymentReceivesTableState,
  })),
  withPaymentsReceivedActions,
);
