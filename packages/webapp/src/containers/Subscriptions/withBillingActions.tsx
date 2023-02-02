// @ts-nocheck
import { connect } from 'react-redux';
import { submitBilling } from '@/store/billing/Billing.action';

export const mapDispatchToProps = (dispatch) => ({
  requestSubmitBilling: (form) => dispatch(submitBilling({ form })),
});

export default connect(null, mapDispatchToProps);
