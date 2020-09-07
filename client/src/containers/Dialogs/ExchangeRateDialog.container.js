import { connect } from 'react-redux';
import { compose } from 'utils';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDialogRedux from 'components/DialogReduxConnect';
import withExchangeRateDetail from 'containers/ExchangeRates/withExchangeRateDetail';
import withExchangeRatesActions from 'containers/ExchangeRates/withExchangeRatesActions';
import withExchangeRates from 'containers/ExchangeRates/withExchangeRates';
import withCurrencies from 'containers/Currencies/withCurrencies';

const mapStateToProps = (state, props) => ({
  dialogName: 'exchangeRate-form',
  exchangeRateId:
    props.payload.action === 'edit' && props.payload.id
      ? props.payload.id
      : null,
});

const withExchangeRateDialog = connect(mapStateToProps);

export default compose(
  withDialogRedux(null, 'exchangeRate-form'),
  withExchangeRateDialog,
  withCurrencies(({ currenciesList }) => ({
    currenciesList,
  })),
  withExchangeRatesActions,
  withExchangeRateDetail,
  withExchangeRates(({ exchangeRatesList }) => ({
    exchangeRatesList,
  })),
  withDialogActions,
);
