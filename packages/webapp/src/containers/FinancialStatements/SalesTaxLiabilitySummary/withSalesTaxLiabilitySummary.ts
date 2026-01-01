// @ts-nocheck
import { connect } from 'react-redux';
import { getSalesTaxLiabilitySummaryFilterDrawer } from '@/store/financialStatement/financialStatements.selectors';

export const withSalesTaxLiabilitySummary = (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      salesTaxLiabilitySummaryFilter:
        getSalesTaxLiabilitySummaryFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
