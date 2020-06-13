import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import {
  Alignment,
  Navbar,
  NavbarGroup,
  Tabs,
  Tab,
  Button,
} from '@blueprintjs/core';
import { useParams, withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage as T } from 'react-intl';

import { useUpdateEffect } from 'hooks';
import Icon from 'components/Icon';

import withExpenses from './withExpenses';
import withExpensesActions from './withExpensesActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

function ExpenseViewTabs({
  //#withExpenses
  expensesViews,

  //#withExpensesActions
  addExpensesTableQueries,

  // #withDashboardActions
  setTopbarEditView,

  // #ownProps
  customViewChanged,
  onViewChanged,
}) {
  const history = useHistory();
  const { custom_view_id: customViewId } = useParams();

  const handleClickNewView = () => {
    setTopbarEditView(null);
    history.push('/custom_views/expenses/new');
  };

  const handleViewLinkClick = () => {
    setTopbarEditView(customViewId);
  };

  useUpdateEffect(() => {
    customViewChanged && customViewChanged(customViewId);

    addExpensesTableQueries({
      custom_view_id: customViewId || null,
    });
    onViewChanged && onViewChanged(customViewId);
  }, [customViewId]);

  useEffect(() => {
    addExpensesTableQueries({
      custom_view_id: customViewId,
    });
  }, [customViewId, addExpensesTableQueries]);

  const tabs = expensesViews.map((view) => {
    const baseUrl = '/expenses/new';
    const link = (
      <Link
        to={`${baseUrl}/${view.id}/custom_view`}
        onClick={handleViewLinkClick}
      >
        {view.name}
      </Link>
    );
    return <Tab id={`custom_view_${view.id}`} title={link} />;
  });

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <Tabs
          id="navbar"
          large={true}
          selectedTabId={`custom_view_${customViewId}`}
          className="tabs--dashboard-views"
        >
          <Tab
            id="all"
            title={
              <Link to={``}>
                <T id={'all'} />
              </Link>
            }
          />
          {tabs}
          <Button
            className="button--new-view"
            icon={<Icon icon="plus" />}
            onClick={handleClickNewView}
            minimal={true}
          />
        </Tabs>
      </NavbarGroup>
    </Navbar>
  );
}

const mapStateToProps = (state, ownProps) => ({
  // Mapping view id from matched route params.
  viewId: ownProps.match.params.custom_view_id,
});

const withExpensesViewTabs = connect(mapStateToProps);

export default compose(
  withRouter,
  withExpensesViewTabs,
  withExpenses(({ expensesViews }) => ({
    expensesViews,
  })),
  withExpensesActions,
  withDashboardActions,
)(ExpenseViewTabs);
