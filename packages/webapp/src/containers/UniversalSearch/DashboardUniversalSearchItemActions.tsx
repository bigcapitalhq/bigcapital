import * as R from 'ramda';
import React from 'react';
import { getUniversalSearchItemsActions } from './utils';
import { withUniversalSearch } from './withUniversalSearch';
import type { WithUniversalSearchProps } from './withUniversalSearch';
import { withUniversalSearchActions } from './withUniversalSearchActions';
import type { WithUniversalSearchActionsProps } from './withUniversalSearchActions';

/**
 * Universal search selected item action based on each resource type.
 */
interface DashboardUniversalSearchItemActionsProps
  extends Pick<
      WithUniversalSearchProps,
      'searchSelectedResourceType' | 'searchSelectedResourceId'
    >,
    Pick<WithUniversalSearchActionsProps, 'resetSelectedItemUniversalSearch'> {}

function DashboardUniversalSearchItemActionsInner({
  searchSelectedResourceType,
  searchSelectedResourceId,

  // #with
  resetSelectedItemUniversalSearch,
}: DashboardUniversalSearchItemActionsProps) {
  const components = getUniversalSearchItemsActions();

  // Handle action execuation.
  const handleActionExec = React.useCallback(() => {
    resetSelectedItemUniversalSearch();
  }, [resetSelectedItemUniversalSearch]);

  return components.map((COMPONENT, index) => (
    <COMPONENT
      key={index}
      resourceId={searchSelectedResourceId}
      resourceType={searchSelectedResourceType}
      onAction={handleActionExec}
    />
  ));
}

export const DashboardUniversalSearchItemActions = R.compose(
  withUniversalSearch(
    ({ searchSelectedResourceType, searchSelectedResourceId }) => ({
      searchSelectedResourceType,
      searchSelectedResourceId,
    }),
  ),
  withUniversalSearchActions,
)(DashboardUniversalSearchItemActionsInner) as unknown as React.ComponentType;
