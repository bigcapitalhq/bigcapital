import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getCashFlowStatementFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithCashFlowStatementProps {
  cashFlowStatementDrawerFilter: ReturnType<
    typeof getCashFlowStatementFilterDrawer
  >;
}

export const withCashFlowStatement = <
  Props = unknown,
  Mapped extends object = WithCashFlowStatementProps,
>(
  mapState?: MapState<WithCashFlowStatementProps, Props, Mapped>,
) => {
  const mapStateToProps: MapStateToProps<
    WithCashFlowStatementProps | Record<string, unknown>,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithCashFlowStatementProps = {
      cashFlowStatementDrawerFilter: getCashFlowStatementFilterDrawer(state),
    };
    return (mapState ? mapState(mapped, state, props) : mapped) as
      | WithCashFlowStatementProps
      | Record<string, unknown>;
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
