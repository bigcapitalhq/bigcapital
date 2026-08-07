import { Alignment, Navbar, NavbarGroup } from '@blueprintjs/core';
import React from 'react';
import { useEstimatesListContext } from './EstimatesListProvider';
import { withEstimates } from './withEstimates';
import { withEstimatesActions } from './withEstimatesActions';
import type { WithEstimatesProps } from './withEstimates';
import { DashboardViewsTabs } from '@/components';
import { compose, transfromViewsToTabs } from '@/utils';

interface WithEstimatesActionsProps {
  setEstimatesTableState: (state: Record<string, any>) => void;
}

interface EstimateViewTabsProps {
  setEstimatesTableState: WithEstimatesActionsProps['setEstimatesTableState'];
  estimatesCurrentView: string;
}

function EstimateViewTabs({
  setEstimatesTableState,
  estimatesCurrentView,
}: EstimateViewTabsProps) {
  const { estimatesViews } = useEstimatesListContext();

  const tabs = transfromViewsToTabs(estimatesViews);

  const handleTabsChange = (viewSlug: string | null) => {
    setEstimatesTableState({ viewSlug: viewSlug || null });
  };

  return (
    <Navbar className={'navbar--dashboard-views'}>
      <NavbarGroup align={Alignment.LEFT}>
        <DashboardViewsTabs
          currentViewSlug={estimatesCurrentView}
          resourceName={'estimates'}
          tabs={tabs}
          onChange={handleTabsChange}
        />
      </NavbarGroup>
    </Navbar>
  );
}

export const EstimatesViewTabs = compose(
  withEstimatesActions,
  withEstimates(({ estimatesTableState }: WithEstimatesProps) => ({
    estimatesCurrentView: estimatesTableState.viewSlug,
  })),
)(EstimateViewTabs);
