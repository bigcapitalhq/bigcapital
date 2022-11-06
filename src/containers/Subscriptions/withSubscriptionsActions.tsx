// @ts-nocheck
import { connect } from 'react-redux';
import { fetchSubscriptions } from '@/store/subscription/subscription.actions';

const mapDispatchToProps = (dispatch) => ({
  requestFetchSubscriptions: () => dispatch(fetchSubscriptions()),
});

export default connect(null, mapDispatchToProps);
