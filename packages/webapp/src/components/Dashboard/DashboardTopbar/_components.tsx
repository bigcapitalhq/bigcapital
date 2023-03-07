// @ts-nocheck
import React from 'react';
import { Button, Classes } from '@blueprintjs/core';
import { useGetUniversalSearchTypeOptions } from '@/containers/UniversalSearch/utils';
import { Icon, FormattedMessage as T } from '@/components';

export function DashboardTopbarSubscriptionMessage() {
  return (
    <div class="dashboard__topbar-subscription-msg">
      <span>
        <T id={'dashboard.subscription_msg.period_over'} />
      </span>
    </div>
  );
}

export function DashboardHamburgerButton({ ...props }) {
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
 * Dashboard quick search button.
 */
export function DashboardQuickSearchButton({ ...rest }) {
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