import { connect } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { getSalesTaxLiabilitySummaryFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';
import { ApplicationState } from '@/store/reducers';

export interface WithSalesTaxLiabilitySummaryProps {
  salesTaxLiabilitySummaryFilter: ReturnType<
    typeof getSalesTaxLiabilitySummaryFilterDrawer
  >;
}

export const withSalesTaxLiabilitySummary = <Props>(
  mapState?: MapState<WithSalesTaxLiabilitySummaryProps, Props>,
) => {
  const mapStateToProps = (state: ApplicationState, props: Props) => {
    const mapped: WithSalesTaxLiabilitySummaryProps = {
      salesTaxLiabilitySummaryFilter:
        getSalesTaxLiabilitySummaryFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
