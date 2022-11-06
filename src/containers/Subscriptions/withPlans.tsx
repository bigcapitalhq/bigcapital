// @ts-nocheck
import { connect } from 'react-redux';
import {
  getPlansSelector,
} from '@/store/plans/plans.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const getPlans = getPlansSelector();

    const mapped = {
      plans: getPlans(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
