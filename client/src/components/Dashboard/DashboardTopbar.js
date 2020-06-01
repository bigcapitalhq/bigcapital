import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import {
  Navbar,
  NavbarGroup,
  Button,
  Classes,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';

import DashboardTopbarUser from 'components/Dashboard/TopbarUser';
import DashboardBreadcrumbs from 'components/Dashboard/DashboardBreadcrumbs';
import withSearch from 'containers/GeneralSearch/withSearch'
import Icon from 'components/Icon';

import { compose } from 'utils';


function DashboardTopbar({
  pageTitle,
  pageSubtitle,
  editViewId,
  globalSearchShow,
  openGlobalSearch,
}) {
  const history = useHistory();

  const handlerClickEditView = () => {
    history.push(`/custom_views/${editViewId}/edit`);
  };

  const maybleRenderPageSubtitle = pageSubtitle && <h3>{pageSubtitle}</h3>;
  const maybeRenderEditViewBtn = pageSubtitle && editViewId && (
    <Button
      className={Classes.MINIMAL + ' button--view-edit'}
      icon={<Icon icon='pen' iconSize={13} />}
      onClick={handlerClickEditView}
    />
  );
  return (
    <div class='dashboard__topbar'>
      <div class='dashboard__topbar-left'>
        <div class='dashboard__topbar-sidebar-toggle'>
          <Button minimal={true}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 20 20'
              role='img'
              focusable='false'
            >
              <title><T id={'menu'}/></title>
              <path
                stroke='currentColor'
                stroke-linecap='round'
                stroke-miterlimit='5'
                stroke-width='2'
                d='M4 7h15M4 12h15M4 17h15'
              ></path>
            </svg>
          </Button>
        </div>

        <div class='dashboard__title'>
          <h1>{pageTitle}</h1>
          {maybleRenderPageSubtitle}
          {maybeRenderEditViewBtn}
        </div>

        <div class='dashboard__breadcrumbs'>
          <DashboardBreadcrumbs />
        </div>
      </div>

      <div class='dashboard__topbar-right'>
        <Navbar class='dashboard__topbar-navbar'>
          <NavbarGroup>
            <Button
              onClick={() => openGlobalSearch(true)}
              className={Classes.MINIMAL}
              icon='home'
              text={<T id={'search'}/>}
            />

            <Button
              className={Classes.MINIMAL}
              icon='document'
              text={<T id={'filters'}/>}
            />
            <Button
              className={Classes.MINIMAL}
              icon='document'
              text={<T id={'add_order'}/>}
            />
            <Button className={Classes.MINIMAL} icon='document' text='More' />
          </NavbarGroup>
        </Navbar>

        <div class='dashboard__topbar-user'>
          <DashboardTopbarUser />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  pageTitle: state.dashboard.pageTitle,
  pageSubtitle: state.dashboard.pageSubtitle,
  editViewId: state.dashboard.topbarEditViewId,
});

export default compose(
  withSearch,
  connect(mapStateToProps)
)(DashboardTopbar);
