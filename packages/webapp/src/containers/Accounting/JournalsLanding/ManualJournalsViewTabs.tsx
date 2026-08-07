import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import { pick } from 'lodash';
import React from 'react';
import { useManualJournalsContext } from './ManualJournalsListProvider';
import { withManualJournals } from './withManualJournals';
import { withManualJournalsActions } from './withManualJournalsActions';
import type { WithManualJournalsProps } from './withManualJournals';
import { DashboardViewsTabs } from '@/components';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { compose } from '@/utils';

// Local loose type mirrors the InvoicesViewTabs pattern — `customViewId` is not
// on `TableQuery` but the reducer accepts it; preserved from @ts-nocheck original.
interface WithManualJournalsActionsProps {
  setManualJournalsTableState: (state: Record<string, unknown>) => void;
}

interface ManualJournalsViewTabsInnerProps
  extends WithManualJournalsActionsProps {
  // The selector merges `paginationLocationQuery` (page_size, page, custom_view_id)
  // with `TableQuery`. Use a looser type so `customViewId` access doesn't fight
  // the SDK-shaped `TableQuery` (matches the latent-bug preserve rule).
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

  const tabs = (journalsViews ?? []).map((view: Record<string, unknown>) => ({
    ...pick(view, ['name', 'id']),
  }));

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
          // `currentViewId` is not a real `DashboardViewsTabs` prop (latent bug
          // preserved from @ts-nocheck — the component accepts `currentViewSlug`).
          // @ts-expect-error see comment above
          currentViewId={journalsTableState.customViewId}
          tabs={tabs}
          onChange={handleTabChange}
          onNewViewTabClick={handleClickNewView}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export const ManualJournalsViewTabs = compose(
  withManualJournalsActions,
  withDashboardActions,
  withManualJournals(({ manualJournalsTableState }) => ({
    journalsTableState: manualJournalsTableState,
  })),
)(ManualJournalsViewTabsInner);
