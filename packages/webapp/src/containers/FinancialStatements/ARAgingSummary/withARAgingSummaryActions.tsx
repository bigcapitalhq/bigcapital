// @ts-nocheck
import { connect } from 'react-redux';
import { toggleARAgingSummaryFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

const mapActionsToProps = (dispatch) => ({
  toggleARAgingSummaryFilterDrawer: (toggle) => 
    dispatch(toggleARAgingSummaryFilterDrawer(toggle)),
});

export const withARAgingSummaryActions = connect(null, mapActionsToProps);
