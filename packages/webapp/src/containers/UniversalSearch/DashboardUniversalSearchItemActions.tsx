// @ts-nocheck
import * as R from 'ramda';
import React from 'react';
import { getUniversalSearchItemsActions } from './utils';
import { withUniversalSearch } from './withUniversalSearch';
import { withUniversalSearchActions } from './withUniversalSearchActions';

/**
 * Universal search selected item action based on each resource type.
 */
function DashboardUniversalSearchItemActionsInner({
  searchSelectedResourceType,
  searchSelectedResourceId,

  // #with
  resetSelectedItemUniversalSearch,
}) {
  const components = getUniversalSearchItemsActions();

  // Handle action execuation.
  const handleActionExec = React.useCallback(() => {
    resetSelectedItemUniversalSearch();
  }, [resetSelectedItemUniversalSearch]);

  return components.map((COMPONENT) => (
    <COMPONENT
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
)(DashboardUniversalSearchItemActionsInner);
