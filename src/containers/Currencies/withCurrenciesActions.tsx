// @ts-nocheck
import { connect } from 'react-redux';
import {
  fetchCurrencies,
  submitCurrencies,
  deleteCurrency,
  editCurrency,
} from '@/store/currencies/currencies.actions';


export const mapDispatchToProps = (dispatch) => ({
  requestFetchCurrencies: () => dispatch(fetchCurrencies({})),
  requestSubmitCurrencies: (form) => dispatch(submitCurrencies({ form })),
  requestEditCurrency: (id, form) => dispatch(editCurrency({ id, form })),
  requestDeleteCurrency: (currency_code) => dispatch(deleteCurrency({ currency_code })),
});

export default connect(null, mapDispatchToProps);
