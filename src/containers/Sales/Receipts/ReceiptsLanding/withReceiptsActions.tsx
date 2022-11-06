// @ts-nocheck
import { connect } from 'react-redux';
import {
  setReceiptsTableState,
  resetReceiptsTableState,
} from '@/store/receipts/receipts.actions';

const mapDispatchToProps = (dispatch) => ({
  setReceiptsTableState: (queries) => dispatch(setReceiptsTableState(queries)),
  resetReceiptsTableState: () => dispatch(resetReceiptsTableState()),
});

export default connect(null, mapDispatchToProps);
