import { connect } from 'react-redux';

export const mapStateToProps = (state, props) => ({
  usersList: state.users.list.results,
});

export default connect(mapStateToProps);
