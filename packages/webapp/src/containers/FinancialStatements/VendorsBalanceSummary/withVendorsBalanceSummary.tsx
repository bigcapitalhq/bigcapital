import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getVendorsBalanceSummaryFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithVendorsBalanceSummaryProps {
  VendorsSummaryFilterDrawer: ReturnType<
    typeof getVendorsBalanceSummaryFilterDrawer
  >;
}

export const withVendorsBalanceSummary = <
  Props,
  Mapped extends object = WithVendorsBalanceSummaryProps,
>(
  mapState?: MapState<WithVendorsBalanceSummaryProps, Props, Mapped>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithVendorsBalanceSummaryProps = {
      VendorsSummaryFilterDrawer: getVendorsBalanceSummaryFilterDrawer(state),
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
