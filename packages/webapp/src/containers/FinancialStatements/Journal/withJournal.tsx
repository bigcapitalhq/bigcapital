import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getJournalFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithJournalProps {
  journalSheetDrawerFilter: ReturnType<typeof getJournalFilterDrawer>;
}

export const withJournal = <Props, Mapped extends object = WithJournalProps>(
  mapState?: MapState<WithJournalProps, Props, Mapped>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithJournalProps = {
      journalSheetDrawerFilter: getJournalFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
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
