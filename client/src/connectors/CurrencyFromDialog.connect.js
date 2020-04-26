import { connect } from 'react-redux';
import {
  fetchCurrencies,
  submitCurrencies,
  deleteCurrency,
  editCurrency,
} from 'store/currencies/currencies.actions';
import { getDialogPayload } from 'store/dashboard/dashboard.reducer';
import { getCurrencyById } from 'store/currencies/currencies.selector';

export const mapStateToProps = (state, props) => {
  const dialogPayload = getDialogPayload(state, 'currency-form');

  return {
    currencies: state.currencies.preferences.currencies,
    name: 'currency-form',
    payload: { action: 'new', id: null, ...dialogPayload },
    editCurrency:
      dialogPayload && dialogPayload.action === 'edit'
        ? state.currencies.preferences.currencies[dialogPayload.currency_code]
        : {},
    getCurrencyId: (id) =>
      getCurrencyById(state.currencies.preferences.currencies, id),
  };
};

export const mapDispatchToProps = (dispatch) => ({
  requestFetchCurrencies: () => dispatch(fetchCurrencies({})),
  requestSubmitCurrencies: (form) => dispatch(submitCurrencies({ form })),
  requestEditCurrency: (id, form) => dispatch(editCurrency({ id, form })),
  requestDeleteCurrency: (currency_code) =>
    dispatch(deleteCurrency({ currency_code })),
});

export default connect(mapStateToProps, mapDispatchToProps);
