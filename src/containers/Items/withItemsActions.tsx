// @ts-nocheck
import { connect } from 'react-redux';
import {
  setItemsTableState,
  resetItemsTableState,
} from '@/store/items/items.actions';

export const mapDispatchToProps = (dispatch) => ({
  setItemsTableState: (queries) => dispatch(setItemsTableState(queries)),
  resetItemsTableState: () => dispatch(resetItemsTableState()),
});

export default connect(null, mapDispatchToProps);
