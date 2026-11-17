import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import {
  getRecurringJournalsTableStateFactory,
  isRecurringJournalsTableStateChangedFactory,
  getRecurringJournalsSelectedRowsFactory,
} from '@/ee/recurring-journals/store/recurring-journals.selector';
import { ApplicationState } from '@/store/reducers';

export interface WithRecurringJournalsProps {
  recurringJournalsTableState: ReturnType<
    ReturnType<typeof getRecurringJournalsTableStateFactory>
  >;
  recurringJournalsTableStateChanged: ReturnType<
    ReturnType<typeof isRecurringJournalsTableStateChangedFactory>
  >;
  recurringJournalsSelectedRows: ReturnType<
    ReturnType<typeof getRecurringJournalsSelectedRowsFactory>
  >;
}

export const withRecurringJournals = <
  Props extends { location?: { search: string } },
  Mapped extends object = WithRecurringJournalsProps,
>(
  mapState?: MapState<WithRecurringJournalsProps, Props, Mapped>,
) => {
  const getRecurringJournalsTableState =
    getRecurringJournalsTableStateFactory();
  const isRecurringJournalsTableStateChanged =
    isRecurringJournalsTableStateChangedFactory();
  const getSelectedRows = getRecurringJournalsSelectedRowsFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithRecurringJournalsProps = {
      recurringJournalsTableState: getRecurringJournalsTableState(state, props),
      recurringJournalsTableStateChanged:
        isRecurringJournalsTableStateChanged(state),
      recurringJournalsSelectedRows: getSelectedRows(state),
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
