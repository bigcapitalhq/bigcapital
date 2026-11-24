import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getBudgetVsActualFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithBudgetVsActualProps {
  budgetVsActualFilter: ReturnType<typeof getBudgetVsActualFilterDrawer>;
}

export const withBudgetVsActual = <
  Props,
  Mapped extends object = WithBudgetVsActualProps,
>(
  mapState?: MapState<WithBudgetVsActualProps, Props, Mapped>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithBudgetVsActualProps = {
      budgetVsActualFilter: getBudgetVsActualFilterDrawer(state),
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
