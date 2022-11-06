// @ts-nocheck
import { connect } from 'react-redux';
import { toggleJournalSheeetFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

export const mapDispatchToProps = (dispatch) => ({
  toggleJournalSheetFilter: (toggle) =>
    dispatch(toggleJournalSheeetFilterDrawer(toggle)),
});

export default connect(null, mapDispatchToProps);
