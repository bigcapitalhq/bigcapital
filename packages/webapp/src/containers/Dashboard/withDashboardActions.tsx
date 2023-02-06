// @ts-nocheck
import { connect } from 'react-redux';
import t from '@/store/types';
import {
  toggleExpendSidebar,
} from '@/store/dashboard/dashboard.actions';
import { splashStartLoading, splashStopLoading } from '@/store/dashboard/dashboard.actions';

const mapActionsToProps = (dispatch) => ({
  changePageTitle: (pageTitle) =>
    dispatch({
      type: t.CHANGE_DASHBOARD_PAGE_TITLE,
      pageTitle,
    }),

  changePageSubtitle: (pageSubtitle) =>
    dispatch({
      type: t.ALTER_DASHBOARD_PAGE_SUBTITLE,
      pageSubtitle,
    }),

  changePageHint: (pageHint) =>
    dispatch({
      type: t.CHANGE_DASHBOARD_PAGE_HINT,
      payload: { pageHint },
    }),

  setTopbarEditView: (id) =>
    dispatch({
      type: t.SET_TOPBAR_EDIT_VIEW,
      id,
    }),

  setDashboardRequestLoading: () =>
    dispatch({
      type: t.SET_DASHBOARD_REQUEST_LOADING,
    }),

  setDashboardRequestCompleted: () =>
    dispatch({
      type: t.SET_DASHBOARD_REQUEST_COMPLETED,
    }),

  /**
   * Toggles the sidebar expend.
   */
  toggleSidebarExpand: (toggle) => dispatch(toggleExpendSidebar(toggle)),

  changePreferencesPageTitle: (pageTitle) =>
    dispatch({
      type: 'CHANGE_PREFERENCES_PAGE_TITLE',
      pageTitle,
    }),

  setDashboardBackLink: (backLink) =>
    dispatch({
      type: t.SET_DASHBOARD_BACK_LINK,
      payload: { backLink },
    }),

  // Splash screen start/stop loading.
  splashStartLoading: () => splashStartLoading(),
  splashStopLoading: () => splashStopLoading(),
});

export default connect(null, mapActionsToProps);
