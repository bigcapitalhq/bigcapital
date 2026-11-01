import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getUnrealizedGainOrLossFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithUnrealizedGainOrLossProps {
  unrealizedGainOrLossDrawerFilter: ReturnType<
    typeof getUnrealizedGainOrLossFilterDrawer
  >;
}

export const withUnrealizedGainOrLoss = <
  Props,
  Mapped extends object = WithUnrealizedGainOrLossProps,
>(
  mapState?: MapState<WithUnrealizedGainOrLossProps, Props, Mapped>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithUnrealizedGainOrLossProps = {
      unrealizedGainOrLossDrawerFilter:
        getUnrealizedGainOrLossFilterDrawer(state),
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
