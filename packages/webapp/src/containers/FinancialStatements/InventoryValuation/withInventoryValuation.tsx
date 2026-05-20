// @ts-nocheck
import { connect } from 'react-redux';
import { getInventoryValuationFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';

export const withInventoryValuation = (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      inventoryValuationDrawerFilter: getInventoryValuationFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
