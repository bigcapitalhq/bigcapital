// @ts-nocheck
import { connect } from 'react-redux';
import {
  getJournalFilterDrawer,
} from '@/store/financial-statement/financial-statements.selectors';

export const withJournal = (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      journalSheetDrawerFilter: getJournalFilterDrawer(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
