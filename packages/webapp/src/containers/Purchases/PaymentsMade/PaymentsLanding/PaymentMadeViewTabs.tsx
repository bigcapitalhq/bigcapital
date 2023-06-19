// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router';
import { DashboardViewsTabs, FormattedMessage as T } from '@/components';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';

import { compose } from '@/utils';
import { usePaymentsMadeListContext } from './PaymentsMadeListProvider';
import { transformPaymentViewsToTabs } from './utils';

import withPaymentMade from './withPaymentMade';
import withPaymentMadeActions from './withPaymentMadeActions';

/**
 * Payment made views tabs.
 */
function PaymentMadeViewTabs({
  // #withPaymentsMadeActions
  setPaymentsMadeTableState,

  // #withPaymentMade
  paymentsMadeTableState,
}) {
  const history = useHistory();

  // Payment receives list context.
  const { paymentsMadeViews } = usePaymentsMadeListContext();

  // Handle the active tab changing.
  const handleTabsChange = (viewSlug) => {
    setPaymentsMadeTableState({ viewSlug });
  };
  // Transforms payment views to tabs.
  const tabs = React.useMemo(
    () => transformPaymentViewsToTabs(paymentsMadeViews),
    [paymentsMadeViews],
  );

  const handleClickNewView = () => {
    history.push('/custom_views/payments-made/new');
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          customViewId={paymentsMadeTableState.customViewId}
          defaultTabText={<T id={'all_payments'} />}
          tabs={tabs}
          onNewViewTabClick={handleClickNewView}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(
  withPaymentMadeActions,
  withPaymentMade(({ paymentsMadeTableState }) => ({ paymentsMadeTableState })),
)(PaymentMadeViewTabs);
