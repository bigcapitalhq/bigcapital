import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  toggleExpendSidebar,
  splashStartLoading,
  splashStopLoading,
} from '@/store/dashboard/dashboard.actions';
import {
  ALTER_DASHBOARD_PAGE_SUBTITLE,
  CHANGE_DASHBOARD_PAGE_HINT,
  CHANGE_DASHBOARD_PAGE_TITLE,
  CHANGE_PREFERENCES_PAGE_TITLE,
  SET_DASHBOARD_BACK_LINK,
  SET_DASHBOARD_REQUEST_COMPLETED,
  SET_DASHBOARD_REQUEST_LOADING,
  SET_TOPBAR_EDIT_VIEW,
} from '@/store/types';

export interface WithDashboardActionsProps {
  changePageTitle: (pageTitle: string) => void;
  changePageSubtitle: (pageSubtitle: string) => void;
  changePageHint: (pageHint: string) => void;
  setTopbarEditView: (id: string | number) => void;
  setDashboardRequestLoading: () => void;
  setDashboardRequestCompleted: () => void;
  toggleSidebarExpand: (toggle?: boolean) => void;
  changePreferencesPageTitle: (pageTitle: string) => void;
  setDashboardBackLink: (backLink: unknown) => void;
  splashStartLoading: () => void;
  splashStopLoading: () => void;
}

const mapActionsToProps = (dispatch: Dispatch): WithDashboardActionsProps => ({
  changePageTitle: (pageTitle) =>
    dispatch({ type: CHANGE_DASHBOARD_PAGE_TITLE, pageTitle }),
  changePageSubtitle: (pageSubtitle) =>
    dispatch({ type: ALTER_DASHBOARD_PAGE_SUBTITLE, pageSubtitle }),
  changePageHint: (pageHint) =>
    dispatch({ type: CHANGE_DASHBOARD_PAGE_HINT, payload: { pageHint } }),
  changePreferencesPageTitle: (pageTitle) =>
    dispatch({ type: CHANGE_PREFERENCES_PAGE_TITLE, pageTitle }),

  setTopbarEditView: (id) => dispatch({ type: SET_TOPBAR_EDIT_VIEW, id }),
  setDashboardRequestLoading: () =>
    dispatch({ type: SET_DASHBOARD_REQUEST_LOADING }),
  setDashboardRequestCompleted: () =>
    dispatch({ type: SET_DASHBOARD_REQUEST_COMPLETED }),

  toggleSidebarExpand: (toggle) => dispatch(toggleExpendSidebar(toggle)),

  setDashboardBackLink: (backLink) =>
    dispatch({ type: SET_DASHBOARD_BACK_LINK, payload: { backLink } }),

  splashStartLoading: () => splashStartLoading(),
  splashStopLoading: () => splashStopLoading(),
});

export function withDashboardActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithDashboardActionsProps>> {
  const Connected = connect(
    null,
    mapActionsToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithDashboardActionsProps>
  >;
}
