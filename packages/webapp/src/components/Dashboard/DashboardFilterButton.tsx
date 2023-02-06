// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import intl from "react-intl-universal";
import { Classes, Button } from '@blueprintjs/core';
import { T, Icon } from '@/components';

/**
 * Dashboard advanced filter button.
 */
export function DashboardFilterButton({ conditionsCount }) {
  return (
    <Button
      className={classNames(Classes.MINIMAL, 'button--filter', {
        'has-active-filters': conditionsCount > 0,
      })}
      text={
        conditionsCount > 0 ? (
          intl.get('count_filters_applied', { count: conditionsCount })
        ) : (
          <T id={'filter'} />
        )
      }
      icon={<Icon icon="filter-16" iconSize={16} />}
    />
  );
}
