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
import { useParams } from 'react-router-dom';
import Icon from 'components/Icon';
import { Link } from 'react-router-dom';
import { compose } from 'utils';

import { useUpdateEffect } from 'hooks';

import withManualJournals from './withManualJournals';
import withManualJournalsActions from './withManualJournalsActions';
import withDashboard from 'containers/Dashboard/withDashboard';


function ManualJournalsViewTabs({
  // #withManualJournals
  manualJournalsViews,
  
  // #withManualJournalsActions
  addManualJournalsTableQueries,

  // #withDashboard
  setTopbarEditView,

  // #ownProps
  customViewChanged,
  onViewChanged,
}) {
  const history = useHistory();
  const { custom_view_id: customViewId } = useParams();

  const handleClickNewView = () => {
    setTopbarEditView(null);
    history.push('/dashboard/custom_views/manual_journals/new');
  };
  const handleViewLinkClick = () => {
    setTopbarEditView(customViewId);
  };

  useUpdateEffect(() => {
    customViewChanged && customViewChanged(customViewId);

    addManualJournalsTableQueries({
      custom_view_id: customViewId || null,
    });
    onViewChanged && onViewChanged(customViewId);
  }, [customViewId]);

  useEffect(() => {
    addManualJournalsTableQueries({
      custom_view_id: customViewId,
    });
  }, [customViewId]);

  const tabs = manualJournalsViews.map((view) => {
    const baseUrl = '/dashboard/accounting/manual-journals';
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
    <Navbar className='navbar--dashboard-views'>
      <NavbarGroup align={Alignment.LEFT}>
        <Tabs
          id='navbar'
          large={true}
          selectedTabId={`custom_view_${customViewId}`}
          className='tabs--dashboard-views'
        >
          <Tab
            id='all'
            title={
              <Link to={`/dashboard/accounting/manual-journals`}>All</Link>
            }
          />
          {tabs}
          <Button
            className='button--new-view'
            icon={<Icon icon='plus' />}
            onClick={handleClickNewView}
            minimal={true}
          />
        </Tabs>
      </NavbarGroup>
    </Navbar>
  );
}

export default compose(
  withManualJournals(({ manualJournalsViews }) => ({
    manualJournalsViews,
  })),
  withManualJournalsActions,
  withDashboard 
)(ManualJournalsViewTabs);
