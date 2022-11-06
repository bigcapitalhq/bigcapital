// @ts-nocheck
import { connect } from 'react-redux';
import {
  getBillsTableStateFactory,
  billsTableStateChangedFactory,
} from '@/store/Bills/bills.selectors';

export default (mapState) => {
  const getBillsTableState = getBillsTableStateFactory();
  const billsTableStateChanged = billsTableStateChangedFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      billsTableState: getBillsTableState(state, props),
      billsTableStateChanged: billsTableStateChanged(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
