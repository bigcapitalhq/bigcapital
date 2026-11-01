import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getBalanceSheetFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithBalanceSheetProps {
  balanceSheetDrawerFilter: ReturnType<typeof getBalanceSheetFilterDrawer>;
}

export const withBalanceSheet = <
  Props = unknown,
  Mapped extends object = WithBalanceSheetProps,
>(
  mapState?: MapState<WithBalanceSheetProps, Props, Mapped>,
) => {
  const mapStateToProps: MapStateToProps<
    WithBalanceSheetProps | Record<string, unknown>,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithBalanceSheetProps = {
      balanceSheetDrawerFilter: getBalanceSheetFilterDrawer(state),
    };
    return (mapState ? mapState(mapped, state, props) : mapped) as
      | WithBalanceSheetProps
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
