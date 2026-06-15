// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router';
import { DashboardViewsTabs, FormattedMessage as T } from '@/components';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';

import { usePaymentMadesListContext } from './PaymentMadesListProvider';
import { transformPaymentViewsToTabs } from './utils';

import { withPaymentMade } from './withPaymentMade';
import { withPaymentMadeActions } from './withPaymentMadeActions';
import { flow } from 'fp-ts/function';

/**
 * Payment made views tabs.
 */
function PaymentMadeViewTabsInner({
  // #withPaymentMadeActions
  setPaymentMadesTableState,

  // #withPaymentMade
  paymentMadesTableState,
}) {
  const history = useHistory();

  // Payment receives list context.
  const { paymentMadesViews } = usePaymentMadesListContext();

  // Handle the active tab changning.
  const handleTabsChange = (viewSlug) => {
    setPaymentMadesTableState({ viewSlug });
  };
  // Transformes payment views to tabs.
  const tabs = React.useMemo(
    () => transformPaymentViewsToTabs(paymentMadesViews),
    [paymentMadesViews],
  );

  const handleClickNewView = () => {
    history.push('/custom_views/payments-made/new');
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          customViewId={paymentMadesTableState.customViewId}
          defaultTabText={<T id={'all_payments'} />}
          tabs={tabs}
          onNewViewTabClick={handleClickNewView}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export const PaymentMadeViewTabs = flow(
  withPaymentMade(({ paymentMadesTableState }) => ({ paymentMadesTableState })),
  withPaymentMadeActions,
)(PaymentMadeViewTabsInner);
