import {
  Alignment,
  Button,
  ButtonGroup,
  NavbarDivider,
  NavbarGroup,
} from '@blueprintjs/core';
import React, { useEffect } from 'react';
import intl from 'react-intl-universal';
import { HomepageContent } from './HomepageContent';
import { HomepageOverview } from './Overview/HomepageOverview';
import styles from './Overview/Overview.module.scss';
import { OverviewPanelsDrawer } from './Overview/OverviewPanelsDrawer';
import {
  useHomepageView,
  useOverviewCompare,
  useOverviewPanels,
} from './Overview/useOverviewPrefs';
import type { HomepageView } from './Overview/useOverviewPrefs';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import { DashboardActionsBar, DashboardInsider } from '@/components/Dashboard';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { useCurrentOrganizationName } from '@/hooks/query';

type DashboardHomepageProps = WithDashboardActionsProps;

const VIEWS: HomepageView[] = ['overview', 'classic'];

/**
 * Dashboard homepage.
 */
function DashboardHomepage({
  // #withDashboardActions
  changePageTitle,
}: DashboardHomepageProps) {
  const organizationName = useCurrentOrganizationName();
  const [view, setView] = useHomepageView();
  const [compare, setCompare] = useOverviewCompare();
  const { panels, move, toggle, resize, reset } = useOverviewPanels();
  const [isPanelsOpen, setPanelsOpen] = React.useState(false);
  const priorYear = new Date().getFullYear() - 1;

  useEffect(() => {
    changePageTitle(organizationName);
  }, [organizationName, changePageTitle]);

  return (
    <DashboardInsider name="homepage">
      <DashboardActionsBar>
        <NavbarGroup>
          <ButtonGroup className={styles.segmented}>
            {VIEWS.map((option) => (
              <Button
                key={option}
                small
                active={view === option}
                aria-pressed={view === option}
                onClick={() => setView(option)}
                data-testId={`homepage-view-${option}`}
              >
                {intl.get(`homepage.overview.view_${option}`)}
              </Button>
            ))}
          </ButtonGroup>
        </NavbarGroup>
        {view === 'overview' && (
          <NavbarGroup align={Alignment.RIGHT}>
            <ButtonGroup
              className={styles.segmented}
              title={intl.get('homepage.overview.compare_hint', {
                year: priorYear,
              })}
            >
              <Button
                small
                active={!compare}
                aria-pressed={!compare}
                onClick={() => setCompare(false)}
              >
                {intl.get('homepage.overview.compare_off')}
              </Button>
              <Button
                small
                active={compare}
                aria-pressed={compare}
                onClick={() => setCompare(true)}
                data-testId="overview-compare-prior"
              >
                {intl.get('homepage.overview.compare_vs', { year: priorYear })}
              </Button>
            </ButtonGroup>
            <NavbarDivider />
            <Button
              small
              onClick={() => setPanelsOpen(true)}
              data-testId="overview-panels"
            >
              {intl.get('homepage.overview.panels')}
            </Button>
          </NavbarGroup>
        )}
      </DashboardActionsBar>

      {view === 'overview' ? (
        <HomepageOverview compare={compare} panels={panels} />
      ) : (
        <HomepageContent />
      )}
      <OverviewPanelsDrawer
        isOpen={isPanelsOpen}
        panels={panels}
        onClose={() => setPanelsOpen(false)}
        onMove={move}
        onToggle={toggle}
        onResize={resize}
        onReset={reset}
      />
    </DashboardInsider>
  );
}

export const Homepage = withDashboardActions(DashboardHomepage);
