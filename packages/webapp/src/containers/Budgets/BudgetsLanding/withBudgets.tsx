import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import {
  getBudgetsTableStateFactory,
  isBudgetsTableStateChangedFactory,
} from '@/store/budgets/budgets.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithBudgetsProps {
  budgetsTableState: ReturnType<ReturnType<typeof getBudgetsTableStateFactory>>;
  budgetsTableStateChanged: ReturnType<
    ReturnType<typeof isBudgetsTableStateChangedFactory>
  >;
}

export const withBudgets = <
  Props extends { location?: { search: string } },
  Mapped extends object = WithBudgetsProps,
>(
  mapState?: MapState<WithBudgetsProps, Props, Mapped>,
) => {
  const getBudgetsTableState = getBudgetsTableStateFactory();
  const isBudgetsTableChanged = isBudgetsTableStateChangedFactory();

  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithBudgetsProps = {
      budgetsTableState: getBudgetsTableState(state, props),
      budgetsTableStateChanged: isBudgetsTableChanged(state),
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
