// @ts-nocheck
import { connect } from 'react-redux';
import { toggleJournalSheetFilterDrawer } from '@/store/financialStatement/financialStatements.actions';

export const mapDispatchToProps = (dispatch) => ({
  toggleJournalSheetFilter: (toggle) =>
    dispatch(toggleJournalSheetFilterDrawer(toggle)),
});

export default connect(null, mapDispatchToProps);
