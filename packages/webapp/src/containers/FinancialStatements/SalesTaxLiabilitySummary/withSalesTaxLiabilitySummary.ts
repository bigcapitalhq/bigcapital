import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { getSalesTaxLiabilitySummaryFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithSalesTaxLiabilitySummaryProps {
  salesTaxLiabilitySummaryFilter: ReturnType<
    typeof getSalesTaxLiabilitySummaryFilterDrawer
  >;
}

export const withSalesTaxLiabilitySummary = <
  Props,
  Mapped extends object = WithSalesTaxLiabilitySummaryProps,
>(
  mapState?: MapState<WithSalesTaxLiabilitySummaryProps, Props, Mapped>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithSalesTaxLiabilitySummaryProps = {
      salesTaxLiabilitySummaryFilter:
        getSalesTaxLiabilitySummaryFilterDrawer(state),
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
