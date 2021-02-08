import {connect} from 'react-redux';
import {
  getItemsTableQueryFactory,
} from 'store/items/items.selectors';

export default (mapState) => {
  const getItemsTableQuery = getItemsTableQueryFactory();
  
  const mapStateToProps = (state, props) => {
    const mapped = {
      itemsSelectedRows: state.items.selectedRows,
      itemsTableQuery: getItemsTableQuery(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};