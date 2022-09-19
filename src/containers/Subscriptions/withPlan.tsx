// @ts-nocheck
import { connect } from 'react-redux';
import { getPlanSelector } from '@/store/plans/plans.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const getPlan = getPlanSelector();

    const mapped = {
      plan: getPlan(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
