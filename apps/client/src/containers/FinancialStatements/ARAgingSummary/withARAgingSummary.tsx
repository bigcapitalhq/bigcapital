// @ts-nocheck
import { connect } from 'react-redux';
import {
  getARAgingSummaryFilterDrawer,
} from '@/store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      ARAgingSummaryFilterDrawer: getARAgingSummaryFilterDrawer(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
