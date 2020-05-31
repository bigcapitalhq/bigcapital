
import { connect } from 'react-redux';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      pageTitle: state.dashboard.pageTitle,
      pageSubtitle: state.dashboard.pageSubtitle,
      editViewId: state.dashboard.topbarEditViewId,
      sidebarExpended: state.dashboard.sidebarExpended,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
}