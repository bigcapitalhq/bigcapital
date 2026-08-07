import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { ApplicationState } from '@/store/reducers';

export interface WithDashboardProps {
  pageTitle: string;
  pageSubtitle: string;
  pageHint: string;
  editViewId: unknown;
  sidebarExpended: boolean;
  preferencesPageTitle: string;
  dashboardBackLink: boolean;
  splashScreenLoading: boolean;
  splashScreenCompleted: boolean;
}

export function withDashboard<Props = unknown>(
  mapState?: MapState<WithDashboardProps, Props>,
) {
  const mapStateToProps: MapStateToProps<
    WithDashboardProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const { dashboard } = state;
    const splash = dashboard.splashScreenLoading ?? 0;
    const mapped: WithDashboardProps = {
      pageTitle: dashboard.pageTitle,
      pageSubtitle: dashboard.pageSubtitle,
      pageHint: dashboard.pageHint,
      editViewId: dashboard.topbarEditViewId,
      sidebarExpended: dashboard.sidebarExpended,
      preferencesPageTitle: dashboard.preferencesPageTitle,
      dashboardBackLink: dashboard.backLink,
      splashScreenLoading: splash > 0,
      splashScreenCompleted: splash === 0,
    };
    return mapState
      ? (mapState(mapped, state, props) as WithDashboardProps)
      : mapped;
  };
  return connect(mapStateToProps);
}
