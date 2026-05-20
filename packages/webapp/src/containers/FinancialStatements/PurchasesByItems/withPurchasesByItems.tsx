// @ts-nocheck
import { connect } from 'react-redux';
import { getPurchasesByItemsFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';

export const withPurchasesByItems = (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      purchasesByItemsDrawerFilter: getPurchasesByItemsFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
