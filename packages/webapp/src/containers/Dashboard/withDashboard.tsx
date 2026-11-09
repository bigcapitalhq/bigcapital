import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
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

export function withDashboard<
  Props = unknown,
  Mapped extends object = WithDashboardProps,
>(mapState?: MapState<WithDashboardProps, Props, Mapped>) {
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
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof Mapped>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof Mapped>>;
  };
}
