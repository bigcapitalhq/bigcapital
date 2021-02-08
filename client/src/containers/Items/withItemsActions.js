import { connect } from 'react-redux';
import t from 'store/types';

export const mapDispatchToProps = (dispatch) => ({
  setItemsTableQuery: (key, value) =>
    dispatch({
      type: t.ITEMS_TABLE_QUERY_SET,
      key,
      value,
    }),
  addItemsTableQueries: (queries) =>
    dispatch({
      type: t.ITEMS_TABLE_QUERIES_ADD,
      payload: { queries },
    }),
  setSelectedRowsItems: (selectedRows) =>
    dispatch({
      type: t.ITEM_SELECTED_ROWS_SET,
      payload: { selectedRows },
    }),
});

export default connect(null, mapDispatchToProps);
