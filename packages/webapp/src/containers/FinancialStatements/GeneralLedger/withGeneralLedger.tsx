import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getGeneralLedgerFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithGeneralLedgerProps {
  generalLedgerFilterDrawer: ReturnType<typeof getGeneralLedgerFilterDrawer>;
}

export const withGeneralLedger = <
  Props = unknown,
  Mapped extends object = WithGeneralLedgerProps,
>(
  mapState?: MapState<WithGeneralLedgerProps, Props, Mapped>,
) => {
  const mapStateToProps: MapStateToProps<
    WithGeneralLedgerProps | Record<string, unknown>,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithGeneralLedgerProps = {
      generalLedgerFilterDrawer: getGeneralLedgerFilterDrawer(state),
    };
    return (mapState ? mapState(mapped, state, props) : mapped) as
      | WithGeneralLedgerProps
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
