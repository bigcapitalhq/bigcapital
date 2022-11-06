// @ts-nocheck
import { connect } from 'react-redux';
import { toggleARAgingSummaryFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

const mapActionsToProps = (dispatch) => ({
  toggleARAgingSummaryFilterDrawer: (toggle) => 
    dispatch(toggleARAgingSummaryFilterDrawer(toggle)),
});

export default connect(null, mapActionsToProps);
