import { connect } from 'react-redux';
import { getReceiptByIdFactory } from 'store/receipt/receipt.selector';

export default () => {
  const getReceiptById = getReceiptByIdFactory();

  const mapStateToProps = (state, props) => ({
    receipt: getReceiptById(state, props),
  });
  return connect(mapStateToProps);
};
