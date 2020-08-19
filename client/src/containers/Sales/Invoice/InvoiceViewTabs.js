import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { useParams, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { pick, debounce } from 'lodash';

import { DashboardViewsTabs } from 'components';
import { useUpdateEffect } from 'hooks';

import withInvoices from './withInvoices';
import withInvoiceActions from './withInvoiceActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';

import { compose } from 'utils';

function InvoiceViewTabs({
  //#withInvoices
  invoicesViews,

  // #withViewDetails
  viewItem,

  //#withInvoiceActions
  changeInvoiceView,
  addInvoiceTableQueries,

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
    changeInvoiceView(customViewId || -1);
    setTopbarEditView(customViewId);
    changePageSubtitle(customViewId && viewItem ? viewItem.name : '');

    addInvoiceTableQueries({
      custom_view_id: customViewId,
    });
    return () => {
      setTopbarEditView(null);
      changePageSubtitle('');
      changeInvoiceView(null);
    };
  }, [customViewId, addInvoiceTableQueries, changeInvoiceView]);

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
    debounceChangeHistory.current(`/invoices/${toPath}`);
    setTopbarEditView(viewId);
  };
  const tabs = invoicesViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));

  // Handle click a new view tab.
  const handleClickNewView = () => {
    setTopbarEditView(null);
    history.push('/custom_views/invoices/new');
  };
  console.log(invoicesViews, 'invoicesViews');

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          initialViewId={customViewId}
          baseUrl={'/invoices'}
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

const withInvoicesViewTabs = connect(mapStateToProps);

export default compose(
  withRouter,
  withInvoicesViewTabs,
  withInvoiceActions,
  withDashboardActions,
  withViewDetails(),
  withInvoices(({ invoicesViews }) => ({
    invoicesViews,
  })),
)(InvoiceViewTabs);
