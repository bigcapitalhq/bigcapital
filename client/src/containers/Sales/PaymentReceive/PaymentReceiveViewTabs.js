import React from 'react';
import { useHistory } from 'react-router';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { FormattedMessage as T } from 'react-intl';
import { pick } from 'lodash';

import { DashboardViewsTabs } from 'components';

import withPaymentReceivesActions from './withPaymentReceivesActions';
import { usePaymentReceivesListContext } from './PaymentReceiptsListProvider';

import { compose } from 'utils';

/**
 * Payment receive view tabs.
 */
function PaymentReceiveViewTabs({
  //#withPaymentReceivesActions
  addPaymentReceivesTableQueries,
}) {
  const history = useHistory();
  const { paymentReceivesViews } = usePaymentReceivesListContext();

  const { custom_view_id: customViewId = null } = useParams();
 
  const tabs = paymentReceivesViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  // Handle click a new view tab.
  const handleClickNewView = () => {
    history.push('/custom_views/payment-receives/new');
  };

  const handleTabsChange = (viewId) => {
    addPaymentReceivesTableQueries({
      custom_view_id: viewId || null,
    });
  }

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          tabs={tabs}
          defaultTabText={<T id={'all_payments'}/>}
          onNewViewTabClick={handleClickNewView}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(
  withPaymentReceivesActions,
)(PaymentReceiveViewTabs);
