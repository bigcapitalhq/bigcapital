// @ts-nocheck
import { connect } from 'react-redux';
import { toggleProjectProfitabilitySummaryFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

const mapDispatchToProps = (dispatch) => ({
  toggleProjectProfitabilitySummaryFilterDrawer: (toggle) =>
    dispatch(toggleProjectProfitabilitySummaryFilterDrawer(toggle)),
});

export default connect(null, mapDispatchToProps);
