// @ts-nocheck
import { connect } from 'react-redux';
import { getInventoryItemDetailsFilterDrawer } from '@/store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      inventoryItemDetailDrawerFilter: getInventoryItemDetailsFilterDrawer(
        state,
        props,
      ),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
