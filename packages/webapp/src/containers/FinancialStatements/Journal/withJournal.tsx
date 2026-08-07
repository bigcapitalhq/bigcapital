import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { getJournalFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithJournalProps {
  journalSheetDrawerFilter: ReturnType<typeof getJournalFilterDrawer>;
}

export const withJournal = <Props,>(
  mapState?: MapState<WithJournalProps, Props>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithJournalProps = {
      journalSheetDrawerFilter: getJournalFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
