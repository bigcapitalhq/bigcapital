import { connect } from 'react-redux';
import {
  submitExchangeRate,
  fetchExchangeRates,
  deleteExchangeRate,
  editExchangeRate,
  deleteBulkExchangeRates
} from 'store/ExchangeRate/exchange.actions';

const mapActionsToProps = (dispatch) => ({
  requestSubmitExchangeRate: (form) => dispatch(submitExchangeRate({ form })),
  requestFetchExchangeRates: () => dispatch(fetchExchangeRates()),
  requestDeleteExchangeRate: (id) => dispatch(deleteExchangeRate(id)),
  requestEditExchangeRate: (id, form) => dispatch(editExchangeRate(id, form)),
  requestDeleteBulkExchangeRates:(ids)=>dispatch(deleteBulkExchangeRates({ids})),
  addExchangeRatesTableQueries: (queries) =>
    dispatch({
      type: 'ExchangeRates_TABLE_QUERIES_ADD',
      queries,
    }),
});

export default connect(null, mapActionsToProps);
