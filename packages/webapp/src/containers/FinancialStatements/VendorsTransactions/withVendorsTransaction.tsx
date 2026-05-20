// @ts-nocheck
import { connect } from 'react-redux';
import { getVendorsTransactionsFilterDrawer } from '@/store/financial-statement/financial-statements.selectors';

export const withVendorsTransaction = (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      vendorsTransactionsDrawerFilter: getVendorsTransactionsFilterDrawer(
        state,
        props,
      ),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
