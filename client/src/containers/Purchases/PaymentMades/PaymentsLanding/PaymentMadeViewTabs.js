import React from 'react';
import { useHistory } from 'react-router';
import { FormattedMessage as T } from 'components';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';

import { DashboardViewsTabs } from 'components';

import { usePaymentMadesListContext } from './PaymentMadesListProvider';
import withPaymentMadeActions from './withPaymentMadeActions';

import { compose } from 'utils';
import { transformPaymentViewsToTabs } from './utils';

import withPaymentMade from './withPaymentMade';

/**
 * Payment made views tabs.
 */
function PaymentMadeViewTabs({
  // #withPaymentMadesActions
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
    history.push('/custom_views/payment-mades/new');
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

export default compose(
  withPaymentMadeActions,
  withPaymentMade(({ paymentMadesTableState }) => ({ paymentMadesTableState })),
)(PaymentMadeViewTabs);
