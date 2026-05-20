// @ts-nocheck
import { connect } from 'react-redux';
import { toggleJournalSheeetFilterDrawer } from '@/store/financial-statement/financial-statements.actions';

export const mapDispatchToProps = (dispatch) => ({
  toggleJournalSheetFilter: (toggle) =>
    dispatch(toggleJournalSheeetFilterDrawer(toggle)),
});

export const withJournalActions = connect(null, mapDispatchToProps);
