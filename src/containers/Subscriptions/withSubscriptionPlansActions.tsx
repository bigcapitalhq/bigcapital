// @ts-nocheck
import { connect } from 'react-redux';
import { initSubscriptionPlans } from '@/store/plans/plans.actions';

export const mapDispatchToProps = (dispatch) => ({
  initSubscriptionPlans: () => dispatch(initSubscriptionPlans()),
});

export default connect(null, mapDispatchToProps);