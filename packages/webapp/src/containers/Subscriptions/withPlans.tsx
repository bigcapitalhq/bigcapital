import { MapStateToProps, connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import {
  getPlansPeriodSelector,
  getPlansSelector,
} from '@/store/plans/plans.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithPlansProps {
  plans: ReturnType<ReturnType<typeof getPlansSelector>>;
  plansPeriod: ReturnType<ReturnType<typeof getPlansPeriodSelector>>;
}

export function withPlans<
  Props = unknown,
  Mapped extends object = WithPlansProps,
>(mapState?: MapState<WithPlansProps, Props, Mapped>) {
  const mapStateToProps: MapStateToProps<
    WithPlansProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const getPlans = getPlansSelector();
    const getPlansPeriod = getPlansPeriodSelector();

    const mapped: WithPlansProps = {
      plans: getPlans(state),
      plansPeriod: getPlansPeriod(state),
    };
    return mapState
      ? (mapState(mapped, state, props) as WithPlansProps)
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
}
