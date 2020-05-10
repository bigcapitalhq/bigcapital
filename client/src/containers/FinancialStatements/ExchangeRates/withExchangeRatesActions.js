import { connect } from 'react-redux';
import {
  submitExchangeRate,
  fetchExchangeRates,
  deleteExchangeRate,
  editExchangeRate,
} from 'store/ExchangeRate/exchange.actions';

export const mapActionsToProps = (dispatch) => ({
  requestSubmitExchangeRate: (form) => dispatch(submitExchangeRate({ form })),
  requestFetchExchangeRates: () => dispatch(fetchExchangeRates()),
  requestDeleteExchangeRate: (id) => dispatch(deleteExchangeRate(id)),
  requestEditExchangeRate: (id, form) => dispatch(editExchangeRate(id, form)),
  addExchangeRatesTableQueries: (queries) =>
    dispatch({
      type: 'ExchangeRates_TABLE_QUERIES_ADD',
      queries,
    }),
});

export default connect(null, mapActionsToProps);
