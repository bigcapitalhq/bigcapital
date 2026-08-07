import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import {
  getManualJournalsSelectedRowsFactory,
  getManualJournalsTableStateFactory,
  manualJournalTableStateChangedFactory,
} from '@/store/manual-journals/manual-journals.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithManualJournalsProps {
  manualJournalsTableState: ReturnType<
    ReturnType<typeof getManualJournalsTableStateFactory>
  >;
  manualJournalTableStateChanged: ReturnType<
    ReturnType<typeof manualJournalTableStateChangedFactory>
  >;
  manualJournalsSelectedRows: ReturnType<
    ReturnType<typeof getManualJournalsSelectedRowsFactory>
  >;
}

export const withManualJournals = <Props = unknown,>(
  mapState?: MapState<WithManualJournalsProps, Props>,
) => {
  const getJournalsTableQuery = getManualJournalsTableStateFactory();
  const manualJournalTableStateChanged =
    manualJournalTableStateChangedFactory();
  const getSelectedRows = getManualJournalsSelectedRowsFactory();

  const mapStateToProps: MapStateToProps<
    WithManualJournalsProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithManualJournalsProps = {
      manualJournalsTableState: getJournalsTableQuery(state, props as never),
      manualJournalTableStateChanged: manualJournalTableStateChanged(state),
      manualJournalsSelectedRows: getSelectedRows(state),
    };
    return mapState
      ? (mapState(mapped, state, props) as WithManualJournalsProps)
      : mapped;
  };
  return connect(mapStateToProps);
};
