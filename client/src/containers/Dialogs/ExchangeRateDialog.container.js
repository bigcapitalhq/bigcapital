import { connect } from 'react-redux';
import { compose } from 'utils';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDialogRedux from 'components/DialogReduxConnect';

import withExchangeRatesActions from 'containers/ExchangeRates/withExchangeRatesActions';
import withExchangeRates from 'containers/ExchangeRates/withExchangeRates';  
import withCurrencies from 'containers/Currencies/withCurrencies';


const mapStateToProps = (state, props) => ({
  dialogName: 'exchangeRate-form',
});

const withExchangeRateDialog = connect(mapStateToProps);

export default compose(
  withExchangeRateDialog,
  withDialogRedux(null, 'exchangeRate-form'),
  withCurrencies(({ currenciesList }) => ({
    currenciesList,
  })),
  withExchangeRates(({ exchangeRatesList }) => ({
    exchangeRatesList,
  })),
  withExchangeRatesActions,
  withDialogActions,
);