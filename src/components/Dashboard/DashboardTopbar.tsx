// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router';
import {
  Navbar,
  NavbarGroup,
  NavbarDivider,
  Button,
  Classes,
  Tooltip,
  Position,
} from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';

import DashboardTopbarUser from '@/components/Dashboard/TopbarUser';
import DashboardBreadcrumbs from '@/components/Dashboard/DashboardBreadcrumbs';
import DashboardBackLink from '@/components/Dashboard/DashboardBackLink';
import { Icon, Hint, If } from '@/components';

import withUniversalSearchActions from '@/containers/UniversalSearch/withUniversalSearchActions';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import withDashboard from '@/containers/Dashboard/withDashboard';

import QuickNewDropdown from '@/containers/QuickNewDropdown/QuickNewDropdown';
import { compose } from '@/utils';
import withSubscriptions from '@/containers/Subscriptions/withSubscriptions';
import { useGetUniversalSearchTypeOptions } from '@/containers/UniversalSearch/utils';

function DashboardTopbarSubscriptionMessage() {
  return (
    <div class="dashboard__topbar-subscription-msg">
      <span>
        <T id={'dashboard.subscription_msg.period_over'} />
      </span>
    </div>
  );
}

function DashboardHamburgerButton({ ...props }) {
  return (
    <Button minimal={true} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        role="img"
        focusable="false"
      >
        <title>
          <T id={'menu'} />
        </title>
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-miterlimit="5"
          stroke-width="2"
          d="M4 7h15M4 12h15M4 17h15"
        ></path>
      </svg>
    </Button>
  );
}

/**
 * Dashboard topbar.
 */
function DashboardTopbar({
  // #withDashboard
  pageTitle,
  editViewId,
  pageHint,

  // #withDashboardActions
  toggleSidebarExpand,

  // #withDashboard
  sidebarExpended,

  // #withGlobalSearch
  openGlobalSearch,

  // #withSubscriptions
  isSubscriptionActive,
  isSubscriptionInactive,
}) {
  const history = useHistory();

  const handlerClickEditView = () => {
    history.push(`/custom_views/${editViewId}/edit`);
  };

  const handleSidebarToggleBtn = () => {
    toggleSidebarExpand();
  };

  return (
    <div class="dashboard__topbar">
      <div class="dashboard__topbar-left">
        <div class="dashboard__topbar-sidebar-toggle">
          <Tooltip
            content={
              !sidebarExpended ? (
                <T id={'open_sidebar'} />
              ) : (
                <T id={'close_sidebar'} />
              )
            }
            position={Position.RIGHT}
          >
            <DashboardHamburgerButton onClick={handleSidebarToggleBtn} />
          </Tooltip>
        </div>

        <div class="dashboard__title">
          <h1>{pageTitle}</h1>

          <If condition={pageHint}>
            <div class="dashboard__hint">
              <Hint content={pageHint} />
            </div>
          </If>

          <If condition={editViewId}>
            <Button
              className={Classes.MINIMAL + ' button--view-edit'}
              icon={<Icon icon="pen" iconSize={13} />}
              onClick={handlerClickEditView}
            />
          </If>
        </div>

        <div class="dashboard__breadcrumbs">
          <DashboardBreadcrumbs />
        </div>
        <DashboardBackLink />
      </div>

      <div class="dashboard__topbar-right">
        <If condition={isSubscriptionInactive}>
          <DashboardTopbarSubscriptionMessage />
        </If>

        <Navbar class="dashboard__topbar-navbar">
          <NavbarGroup>
            <If condition={isSubscriptionActive}>
              <DashboardQuickSearchButton
                onClick={() => openGlobalSearch(true)}
              />
              <QuickNewDropdown />

              <Tooltip
                content={<T id={'notifications'} />}
                position={Position.BOTTOM}
              >
                <Button
                  className={Classes.MINIMAL}
                  icon={<Icon icon={'notification-24'} iconSize={20} />}
                />
              </Tooltip>
            </If>

            <Button
              className={Classes.MINIMAL}
              icon={<Icon icon={'help-24'} iconSize={20} />}
              text={<T id={'help'} />}
            />
            <NavbarDivider />
          </NavbarGroup>
        </Navbar>

        <div class="dashboard__topbar-user">
          <DashboardTopbarUser />
        </div>
      </div>
    </div>
  );
}

export default compose(
  withUniversalSearchActions,
  withDashboard(({ pageTitle, pageHint, editViewId, sidebarExpended }) => ({
    pageTitle,
    editViewId,
    sidebarExpended,
    pageHint,
  })),
  withDashboardActions,
  withSubscriptions(
    ({ isSubscriptionActive, isSubscriptionInactive }) => ({
      isSubscriptionActive,
      isSubscriptionInactive,
    }),
    'main',
  ),
)(DashboardTopbar);

/**
 * Dashboard quick search button.
 */
function DashboardQuickSearchButton({ ...rest }) {
  const searchTypeOptions = useGetUniversalSearchTypeOptions();

  // Can't continue if there is no any search type option.
  if (searchTypeOptions.length <= 0) {
    return null;
  }
  return (
    <Button
      className={Classes.MINIMAL}
      icon={<Icon icon={'search-24'} iconSize={20} />}
      text={<T id={'quick_find'} />}
      {...rest}
    />
  );
}
