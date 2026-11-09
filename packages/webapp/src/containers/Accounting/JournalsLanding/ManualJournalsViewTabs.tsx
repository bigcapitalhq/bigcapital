import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import { useManualJournalsContext } from './ManualJournalsListProvider';
import { withManualJournals } from './withManualJournals';
import { withManualJournalsActions } from './withManualJournalsActions';
import { DashboardViewsTabs } from '@/components';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { transfromViewsToTabs } from '@/utils';

// The action payload is a loose state object; `customViewId` is not part of
// the typed `TableQuery` action signature.
interface WithManualJournalsActionsProps {
  setManualJournalsTableState: (state: Record<string, unknown>) => void;
}

interface ManualJournalsViewTabsInnerProps
  extends WithManualJournalsActionsProps {
  // The selector merges `paginationLocationQuery` (page_size, page, custom_view_id)
  // with `TableQuery`, so the state is kept loose.
  journalsTableState: Record<string, any>;
}

/**
 * Manual journal views tabs.
 */
function ManualJournalsViewTabsInner({
  // #withManualJournalsActions
  setManualJournalsTableState,

  // #withManualJournals
  journalsTableState,
}: ManualJournalsViewTabsInnerProps) {
  // Manual journals context.
  const { journalsViews } = useManualJournalsContext();

  const tabs = transfromViewsToTabs(journalsViews ?? []);

  const handleClickNewView = () => {};

  // Handles the tab change.
  const handleTabChange = (viewId: number | null) => {
    setManualJournalsTableState({
      customViewId: viewId || null,
    });
  };

  return (
    <Navbar className="navbar--dashboard-views">
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          resourceName={'manual-journals'}
          currentViewSlug={journalsTableState.customViewId}
          tabs={tabs}
          onChange={handleTabChange}
          onNewViewTabClick={handleClickNewView}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export const ManualJournalsViewTabs = FF.pipe(
  ManualJournalsViewTabsInner,
  withManualJournals(({ manualJournalsTableState }) => ({
    journalsTableState: manualJournalsTableState,
  })),
  withDashboardActions,
  withManualJournalsActions,
);
