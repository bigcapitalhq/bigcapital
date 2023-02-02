// @ts-nocheck
import { connect } from 'react-redux';
import { getSalesByItemsFilterDrawer } from '@/store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      salesByItemsDrawerFilter: getSalesByItemsFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
