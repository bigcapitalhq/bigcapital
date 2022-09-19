// @ts-nocheck
import { connect } from 'react-redux';
import { getCustomersBalanceSummaryFilterDrawer } from '@/store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      customersBalanceDrawerFilter: getCustomersBalanceSummaryFilterDrawer(
        state,
        props,
      ),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
