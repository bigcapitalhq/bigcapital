// @ts-nocheck

import { connect } from 'react-redux';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      pageTitle: state.dashboard.pageTitle,
      pageSubtitle: state.dashboard.pageSubtitle,
      pageHint: state.dashboard.pageHint,
      editViewId: state.dashboard.topbarEditViewId,
      sidebarExpended: state.dashboard.sidebarExpended,
      preferencesPageTitle: state.dashboard.preferencesPageTitle,
      dashboardBackLink: state.dashboard.backLink,
      splashScreenLoading: state.dashboard.splashScreenLoading > 0,
      splashScreenCompleted: state.dashboard.splashScreenLoading === 0,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
}
