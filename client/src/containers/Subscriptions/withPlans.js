import { connect } from 'react-redux';
import {
  getPlansSelector,
  getPlansPeriodsSelector,
} from 'store/plans/plans.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const getPlans = getPlansSelector();
    const getPlansPeriods = getPlansPeriodsSelector();

    const mapped = {
      plans: getPlans(state, props),
      plansPeriods: getPlansPeriods(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
