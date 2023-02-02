// @ts-nocheck
import { connect } from 'react-redux';
import { toggleAPAgingSummaryFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

const mapActionsToProps = (dispatch) => ({
  toggleAPAgingSummaryFilterDrawer: (toggle) =>
    dispatch(toggleAPAgingSummaryFilterDrawer(toggle)),
});

export default connect(null, mapActionsToProps);
