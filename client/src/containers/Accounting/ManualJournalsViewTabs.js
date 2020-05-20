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
import { compose } from 'utils';
import Icon from 'components/Icon';

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
    history.push('/custom_views/manual_journals/new');
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
    const baseUrl = '/manual-journals';
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
              <Link to={`/dashboard/accounting/manual-journals`}>
                <T id={'all'} />
              </Link>
            }
          />

          { tabs }

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

const mapStateToProps = (state, ownProps) => ({
  // Mapping view id from matched route params.
  viewId: ownProps.match.params.custom_view_id,
});

const withManualJournalsViewTabs = connect(mapStateToProps);

export default compose(
  withRouter,
  withManualJournalsViewTabs,
  withManualJournals(({ manualJournalsViews }) => ({
    manualJournalsViews,
  })),
  withManualJournalsActions,
  withDashboard 
)(ManualJournalsViewTabs);
