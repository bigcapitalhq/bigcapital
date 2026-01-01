// @ts-nocheck
import { connect } from 'react-redux';
import { fetchSubscriptions } from '@/store/subscription/subscription.actions';

const mapDispatchToProps = (dispatch) => ({
  requestFetchSubscriptions: () => dispatch(fetchSubscriptions()),
});

export const withSubscriptionsActions = connect(null, mapDispatchToProps);
