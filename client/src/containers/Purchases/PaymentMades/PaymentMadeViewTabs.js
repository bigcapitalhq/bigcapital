import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { pick, debounce } from 'lodash';

import { DashboardViewsTabs } from 'components';
import { useUpdateEffect } from 'hooks';

import withPaymentMade from './withPaymentMade';
import withPaymentMadeActions from './withPaymentMadeActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';

import { compose } from 'utils';

function PaymentMadeViewTabs({
  //#withPaymentMades
  paymentMadeViews,

  //#withPaymentMadesActions
  changePaymentMadeView,
  addPaymentMadesTableQueries,

  // #withViewDetails
  viewItem,

  // #withDashboardActions
  setTopbarEditView,
  changePageSubtitle,

  //#Own Props
  onViewChanged,
}) {
  const history = useHistory();
  const { custom_view_id: customViewId = null } = useParams();

  useEffect(() => {
    changePaymentMadeView(customViewId || -1);
    setTopbarEditView(customViewId);
    changePageSubtitle(customViewId && viewItem ? viewItem.name : '');

    addPaymentMadesTableQueries({
      custom_view_id: customViewId,
    });
    return () => {
      setTopbarEditView(null);
      changePageSubtitle('');
      changePaymentMadeView(null);
    };
  }, [customViewId, addPaymentMadesTableQueries, changePaymentMadeView]);

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
    debounceChangeHistory.current(`/payment-mades/${toPath}`);
    setTopbarEditView(viewId);
  };
  const tabs = paymentMadeViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  const handleClickNewView = () => {
    setTopbarEditView(null);
    history.push('/custom_views/payment-mades/new');
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          baseUrl={'/payment-mades'}
          tabs={tabs}
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

const withPaymentMadesViewTabs = connect(mapStateToProps);

export default compose(
  withRouter,
  withPaymentMadesViewTabs,
  withPaymentMadeActions,
  withDashboardActions,
  withViewDetails(),
  withPaymentMade(({ paymentMadeViews }) => ({
    paymentMadeViews,
  })),
)(PaymentMadeViewTabs);
