import { connect } from 'react-redux';
import {
  getItemById
} from 'store/selectors';

const mapStateToProps = (state, props) => ({
  account: getItemById(state.accounts.items, props.accountId),
});

export default connect(mapStateToProps);