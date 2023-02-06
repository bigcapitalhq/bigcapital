// @ts-nocheck
import { connect } from 'react-redux';
import { getProjectProfitabilitySummaryFilterDrawer } from '@/store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      projectProfitabilitySummaryDrawerFilter:
        getProjectProfitabilitySummaryFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
