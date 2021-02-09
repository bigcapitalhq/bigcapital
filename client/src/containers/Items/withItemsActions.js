import { connect } from 'react-redux';
import { setItemsTableState }from 'store/items/items.actions';

export const mapDispatchToProps = (dispatch) => ({
  setItemsTableState: (queries) => dispatch(setItemsTableState(queries)),
  // setSelectedRowsItems: (selectedRows) =>
  //   dispatch({
  //     type: t.ITEM_SELECTED_ROWS_SET,
  //     payload: { selectedRows },
  //   }),
});

export default connect(null, mapDispatchToProps);
