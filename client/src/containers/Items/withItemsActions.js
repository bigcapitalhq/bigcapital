import { connect } from 'react-redux';
import { setItemsTableState }from 'store/items/items.actions';

export const mapDispatchToProps = (dispatch) => ({
  setItemsTableState: (queries) => dispatch(setItemsTableState(queries)),
});

export default connect(null, mapDispatchToProps);
