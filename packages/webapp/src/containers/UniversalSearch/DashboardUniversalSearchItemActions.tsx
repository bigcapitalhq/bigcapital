import * as FF from 'fp-ts/function';
import React from 'react';
import { getUniversalSearchItemsActions } from './utils';
import { withUniversalSearch } from './withUniversalSearch';
import { withUniversalSearchActions } from './withUniversalSearchActions';
import type { WithUniversalSearchProps } from './withUniversalSearch';
import type { WithUniversalSearchActionsProps } from './withUniversalSearchActions';

interface DashboardUniversalSearchItemActionsInnerProps
  extends Pick<
      WithUniversalSearchActionsProps,
      'resetSelectedItemUniversalSearch'
    >,
    Pick<
      WithUniversalSearchProps,
      'searchSelectedResourceType' | 'searchSelectedResourceId'
    > {}

/**
 * Universal search selected item action based on each resource type.
 */
function DashboardUniversalSearchItemActionsInner({
  searchSelectedResourceType,
  searchSelectedResourceId,

  // #with
  resetSelectedItemUniversalSearch,
}: DashboardUniversalSearchItemActionsInnerProps) {
  const components = getUniversalSearchItemsActions();

  // Handle action execuation.
  const handleActionExec = React.useCallback(() => {
    resetSelectedItemUniversalSearch();
  }, [resetSelectedItemUniversalSearch]);

  return (
    <>
      {components.map((COMPONENT, index) => (
        <COMPONENT
          key={index}
          resourceId={searchSelectedResourceId as number}
          resourceType={String(searchSelectedResourceType)}
          onAction={handleActionExec}
        />
      ))}
    </>
  );
}

export const DashboardUniversalSearchItemActions = FF.pipe(
  DashboardUniversalSearchItemActionsInner,
  withUniversalSearchActions,
  withUniversalSearch(
    ({ searchSelectedResourceType, searchSelectedResourceId }) => ({
      searchSelectedResourceType,
      searchSelectedResourceId,
    }),
  ),
);
