// @ts-nocheck
import { connect } from 'react-redux';
import { getEstimateByIdFactory } from '@/store/Estimate/estimates.selectors';

export default () => {
  const getEstimateById = getEstimateByIdFactory();

  const mapStateToProps = (state, props) => ({
    estimate: getEstimateById(state, props),
  });
  return connect(mapStateToProps);
};
