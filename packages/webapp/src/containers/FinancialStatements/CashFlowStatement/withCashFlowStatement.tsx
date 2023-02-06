// @ts-nocheck
import { connect } from 'react-redux';
import { getCashFlowStatementFilterDrawer } from '@/store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      cashFlowStatementDrawerFilter: getCashFlowStatementFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
