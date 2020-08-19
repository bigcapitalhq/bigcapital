import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { pick, debounce } from 'lodash';

import { DashboardViewsTabs } from 'components';
import { useUpdateEffect } from 'hooks';

import withBills from './withBills';
import withBillActions from './withBillActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';

import { compose } from 'utils';

function BillViewTabs({
  //#withBills
  billsViews,

  // #withViewDetails
  viewItem,

  //#withBillActions
  changeBillView,
  addBillsTableQueries,

  // #withDashboardActions
  setTopbarEditView,
  changePageSubtitle,

  // #ownProps
  customViewChanged,
  onViewChanged,
}) {
  const history = useHistory();
  const { custom_view_id: customViewId = null } = useParams();

  useEffect(() => {
    changeBillView(customViewId || -1);
    setTopbarEditView(customViewId);
    changePageSubtitle(customViewId && viewItem ? viewItem.name : '');

    addBillsTableQueries({
      custom_view_id: customViewId,
    });
    return () => {
      setTopbarEditView(null);
      changePageSubtitle('');
      changeBillView(null);
    };
  }, [customViewId, addBillsTableQueries, changeBillView]);

  useUpdateEffect(() => {
    onViewChanged && onViewChanged(customViewId);
  }, [customViewId]);

  const debounceChangeHistory = useRef(
    debounce((toUrl) => {
      history.push(toUrl);
    }, 250),
  );
  // Handle click a new view tab.
  const handleClickNewView = () => {
    setTopbarEditView(null);
    history.push('/custom_views/invoices/new');
  };
  const handleTabsChange = (viewId) => {
    const toPath = viewId ? `${viewId}/custom_view` : '';
    debounceChangeHistory.current(`/bills/${toPath}`);
    setTopbarEditView(viewId);
  };
  const tabs = billsViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  console.log(billsViews, 'billsViews');

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          baseUrl={'/bills'}
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

const withBillsViewTabs = connect(mapStateToProps);

export default compose(
  withRouter,
  withBillsViewTabs,
  withBillActions,
  withDashboardActions,
  withViewDetails(),
  withBills(({ billsViews }) => ({
    billsViews,
  })),
)(BillViewTabs);
