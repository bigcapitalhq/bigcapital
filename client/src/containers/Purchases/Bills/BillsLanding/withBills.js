import { connect } from 'react-redux';
import { getBillsTableStateFactory } from 'store/Bills/bills.selectors';

export default (mapState) => {
  const getBillsTableState = getBillsTableStateFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      billsTableState: getBillsTableState(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
