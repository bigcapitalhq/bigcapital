import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getRealizedGainOrLossFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithRealizedGainOrLossProps {
  realizedGainOrLossDrawerFilter: ReturnType<
    typeof getRealizedGainOrLossFilterDrawer
  >;
}

export const withRealizedGainOrLoss = <
  Props,
  Mapped extends object = WithRealizedGainOrLossProps,
>(
  mapState?: MapState<WithRealizedGainOrLossProps, Props, Mapped>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithRealizedGainOrLossProps = {
      realizedGainOrLossDrawerFilter: getRealizedGainOrLossFilterDrawer(state),
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
