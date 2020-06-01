import { connect } from 'react-redux';
import { compose } from 'utils';
import { getDialogPayload } from 'store/dashboard/dashboard.reducer';

import withDialogActions from 'containers/Dialog/withDialogActions';
import DialogReduxConnect from 'components/DialogReduxConnect';

import withExchangeRatesActions from 'containers/ExchangeRates/withExchangeRatesActions';
import withExchangeRates from 'containers/ExchangeRates/withExchangeRates';  
import withCurrencies from 'containers/Currencies/withCurrencies';


const mapStateToProps = (state, props) => {
  const dialogPayload = getDialogPayload(state, 'exchangeRate-form');

  return {
    name: 'exchangeRate-form',
    payload: { action: 'new', id: null, ...dialogPayload },
  };
};

const withExchangeRateDialog = connect(mapStateToProps);

export default compose(
  withExchangeRateDialog,
  withCurrencies(({ currenciesList }) => ({
    currenciesList,
  })),
  withExchangeRatesActions,
  withExchangeRates(({ exchangeRatesList }) => ({
    exchangeRatesList,
  })),
  DialogReduxConnect,
  withDialogActions,
);