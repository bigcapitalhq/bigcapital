import { connect } from 'react-redux';
import { getAccountById } from 'store/accounts/accounts.selectors';

const mapStateToProps = (state, props) => ({
  account: getAccountById(state, props),
});

export default connect(mapStateToProps);