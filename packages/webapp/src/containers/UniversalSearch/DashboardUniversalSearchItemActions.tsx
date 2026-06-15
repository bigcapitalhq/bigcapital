// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import { withUniversalSearch } from './withUniversalSearch';

import { getUniversalSearchItemsActions } from './utils';
import { withUniversalSearchActions } from './withUniversalSearchActions';
import { flow } from 'fp-ts/function';

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

export const DashboardUniversalSearchItemActions = flow(
  withUniversalSearchActions,
  withUniversalSearch(
    ({ searchSelectedResourceType, searchSelectedResourceId }) => ({
      searchSelectedResourceType,
      searchSelectedResourceId,
    }),
  ),
)(DashboardUniversalSearchItemActionsInner);
