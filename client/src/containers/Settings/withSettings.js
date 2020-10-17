import { connect } from 'react-redux';

export const mapStateToProps = (state, props) => ({
  organizationSettings: state.settings.data.organization,
  manualJournalsSettings: state.settings.data.manual_journals,
});

export default connect(mapStateToProps);
