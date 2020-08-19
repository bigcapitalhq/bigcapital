import { connect } from 'react-redux';
import { getBillByIdFactory } from 'store/Bills/bills.selectors';

export default () => {
  const getBillById = getBillByIdFactory();

  const mapStateToProps = (state, props) => ({
    bill: getBillById(state, props),
  });
  return connect(mapStateToProps);
};
