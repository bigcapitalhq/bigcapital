// @ts-nocheck
import {connect} from 'react-redux';
import {
  getProfitLossFilterDrawer,
} from '@/store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      profitLossDrawerFilter: getProfitLossFilterDrawer(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
}