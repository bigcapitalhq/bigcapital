import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getTrialBalanceSheetFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithTrialBalanceProps {
  trialBalanceDrawerFilter: ReturnType<typeof getTrialBalanceSheetFilterDrawer>;
}

export const withTrialBalance = <
  Props,
  Mapped extends object = WithTrialBalanceProps,
>(
  mapState?: MapState<WithTrialBalanceProps, Props, Mapped>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithTrialBalanceProps = {
      trialBalanceDrawerFilter: getTrialBalanceSheetFilterDrawer(state),
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
