import { connect } from 'react-redux';

export const mapStateToProps = (state, props) => ({
  organizationSettings: state.settings.data.organization,
});

export default connect(mapStateToProps);
