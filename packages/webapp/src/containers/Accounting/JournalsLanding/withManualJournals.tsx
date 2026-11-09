import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
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

export const withManualJournals = <
  Props = unknown,
  Mapped extends object = WithManualJournalsProps,
>(
  mapState?: MapState<WithManualJournalsProps, Props, Mapped>,
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
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof Mapped>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof Mapped>>;
  };
};
