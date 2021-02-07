import React from 'react';
import { useHistory } from 'react-router';
import { FormattedMessage as T } from 'react-intl';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { pick } from 'lodash';

import { DashboardViewsTabs } from 'components';

import { usePaymentMadesListContext } from './PaymentMadesListProvider';
import withPaymentMadeActions from './withPaymentMadeActions';

import { compose } from 'utils';

function PaymentMadeViewTabs({
  //#withPaymentMadesActions
  addPaymentMadesTableQueries,
}) {
  const history = useHistory();
  const { custom_view_id: customViewId = null } = useParams();

  // Payment receives list context.
  const { paymentMadesViews } = usePaymentMadesListContext();

  const handleTabsChange = (viewId) => {
    addPaymentMadesTableQueries({
      custom_view_id: viewId || null,
    });
  };

  const tabs = paymentMadesViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  const handleClickNewView = () => {
    history.push('/custom_views/payment-mades/new');
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          defaultTabText={<T id={'all_payments'} />}
          tabs={tabs}
          onNewViewTabClick={handleClickNewView}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(withPaymentMadeActions)(PaymentMadeViewTabs);
