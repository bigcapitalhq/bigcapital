import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams, withRouter } from 'react-router-dom';
import { FormattedMessage as T } from 'react-intl';
import { connect } from 'react-redux';
import { pick, debounce } from 'lodash';

import { DashboardViewsTabs } from 'components';
import { useUpdateEffect } from 'hooks';

import withPaymentReceives from './withPaymentReceives';
import withPaymentReceivesActions from './withPaymentReceivesActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';

import { compose } from 'utils';

function PaymentReceiveViewTabs({
  //#withPaymentReceives
  paymentReceivesViews,

  //#withPaymentReceivesActions
  changePaymentReceiveView,
  addPaymentReceivesTableQueries,

  // #withViewDetails
  viewItem,

  // #withDashboardActions
  setTopbarEditView,
  changePageSubtitle,

  //#Own Props
  customViewChanged,
  onViewChanged,
}) {
  const history = useHistory();
  const { custom_view_id: customViewId = null } = useParams();

  useEffect(() => {
    changePaymentReceiveView(customViewId || -1);
    setTopbarEditView(customViewId);
    changePageSubtitle(customViewId && viewItem ? viewItem.name : '');

    addPaymentReceivesTableQueries({
      custom_view_id: customViewId,
    });
    return () => {
      setTopbarEditView(null);
      changePageSubtitle('');
      changePaymentReceiveView(null);
    };
  }, [customViewId, addPaymentReceivesTableQueries, changePaymentReceiveView]);

  useUpdateEffect(() => {
    onViewChanged && onViewChanged(customViewId);
  }, [customViewId]);

  const debounceChangeHistory = useRef(
    debounce((toUrl) => {
      history.push(toUrl);
    }, 250),
  );

  const handleTabsChange = (viewId) => {
    const toPath = viewId ? `${viewId}/custom_view` : '';
    debounceChangeHistory.current(`/payment-receives/${toPath}`);
    setTopbarEditView(viewId);
  };
  const tabs = paymentReceivesViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  // Handle click a new view tab.
  const handleClickNewView = () => {
    setTopbarEditView(null);
    history.push('/custom_views/payment-receives/new');
  };

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

const mapStateToProps = (state, ownProps) => ({
  viewId: ownProps.match.params.custom_view_id,
});

const withPaymentReceivesViewTabs = connect(mapStateToProps);

export default compose(
  withRouter,
  withPaymentReceivesViewTabs,
  withPaymentReceivesActions,
  withDashboardActions,
  withViewDetails(),
  withPaymentReceives(({ paymentReceivesViews }) => ({
    paymentReceivesViews,
  })),
)(PaymentReceiveViewTabs);
