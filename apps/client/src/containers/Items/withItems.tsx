// @ts-nocheck
import {connect} from 'react-redux';
import {
  getItemsTableStateFactory,
  isItemsTableStateChangedFactory,
} from '@/store/items/items.selectors';

export default (mapState) => {
  const getItemsTableState = getItemsTableStateFactory();
  const isItemsTableStateChanged = isItemsTableStateChangedFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      itemsSelectedRows: state.items.selectedRows,
      itemsTableState: getItemsTableState(state, props),
      itemsTableStateChanged: isItemsTableStateChanged(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};