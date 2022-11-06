// @ts-nocheck
import { connect } from 'react-redux';
import { getCustomerById } from '@/store/customers/customers.reducer';

const mapStateToProps = (state, props) => ({
  customer: getCustomerById(state, props.customerId),
});

export default connect(mapStateToProps);
