import { connect } from 'react-redux';
import t from 'store/types';
import {
  submitPaymentMade,
  editPaymentMade,
  deletePaymentMade,
  fetchPaymentMadesTable,
  fetchPaymentMade,
} from 'store/PaymentMades/paymentMade.actions';

const mapDispatchToProps = (dispatch) => ({
  requestSubmitPaymentMade: (form) => dispatch(submitPaymentMade({ form })),
  requestFetchPaymentMade: (id) => dispatch(fetchPaymentMade({ id })),
  requestEditPaymentMade: (id, form) => dispatch(editPaymentMade(id, form)),
  requestDeletePaymentMade: (id) => dispatch(deletePaymentMade({ id })),
  requestFetchPaymentMadesTable: (query = {}) =>
    dispatch(fetchPaymentMadesTable({ query: { ...query } })),

  changePaymentMadeView: (id) =>
    dispatch({
      type: t.PAYMENT_MADE_SET_CURRENT_VIEW,
      currentViewId: parseInt(id, 10),
    }),

  addPaymentMadesTableQueries: (queries) =>
    dispatch({
      type: t.PAYMENT_MADE_TABLE_QUERIES_ADD,
      queries,
    }),
  setPaymentNumberChange: (isChanged) =>
    dispatch({
      type: t.PAYMENT_MADES_NUMBER_CHANGED,
      payload: { isChanged },
    }),
});
export default connect(null, mapDispatchToProps);
