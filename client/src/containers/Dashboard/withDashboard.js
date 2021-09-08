
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
      appIsLoading: state.dashboard.appIsLoading,
      appIntlIsLoading: state.dashboard.appIntlIsLoading
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
}
