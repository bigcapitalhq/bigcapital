import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { pick, debounce } from 'lodash';

import { DashboardViewsTabs } from 'components';
import { useUpdateEffect } from 'hooks';

import withReceipts from './withReceipts';
import withReceiptActions from './withReceiptActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';

import { compose } from 'utils';

/**
 * Receipt views tabs.
 */
function ReceiptViewTabs({
  //#withReceipts
  receiptview,
  // #withViewDetails
  viewItem,

  //#withReceiptActions
  changeReceiptView,
  addReceiptsTableQueries,

  // #withDashboardActions
  setTopbarEditView,
  changePageSubtitle,

  //# own Props
  customViewChanged,
  onViewChanged,
}) {
  const history = useHistory();
  const { custom_view_id: customViewId = null } = useParams();

  useEffect(() => {
    setTopbarEditView(customViewId);
    changePageSubtitle(customViewId && viewItem ? viewItem.name : '');
    // changeReceiptView(customViewId || -1);
    // addReceiptsTableQueries({
    //   custom_view_id: customViewId || null,
    // });
  }, [customViewId, addReceiptsTableQueries]);

  const tabs = receiptview.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  const handleTabsChange = (viewId) => {
    changeReceiptView(viewId || -1);
    addReceiptsTableQueries({
      custom_view_id: viewId || null,
    });
    setTopbarEditView(viewId);
  };

  // Handle click a new view tab.
  const handleClickNewView = () => {
    setTopbarEditView(null);
    history.push('/custom_views/receipts/new');
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          tabs={tabs}
          resourceName={'receipts'}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

const mapStateToProps = (state, ownProps) => ({
  viewId: ownProps.match.params.custom_view_id,
});

const withReceiptsViewTabs = connect(mapStateToProps);

export default compose(
  withRouter,
  withReceiptsViewTabs,
  withReceiptActions,
  withDashboardActions,
  withViewDetails(),
  withReceipts(({ receiptview }) => ({ receiptview })),
)(ReceiptViewTabs);
