import { MapStateToProps, connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ApplicationState } from '@/store/reducers';
import type { ComponentType } from 'react';
import { getPlanSelector } from '@/store/plans/plans.selectors';

export interface WithPlanProps {
  plan: ReturnType<ReturnType<typeof getPlanSelector>>;
}

export const withPlan = <
  Props = unknown,
  Mapped extends object = WithPlanProps,
>(
  mapState?: MapState<WithPlanProps, Props, Mapped>,
) => {
  const mapStateToProps: MapStateToProps<
    WithPlanProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const getPlan = getPlanSelector();

    const mapped: WithPlanProps = {
      plan: getPlan(state, props as never),
    };
    return mapState
      ? (mapState(mapped, state, props) as WithPlanProps)
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
