import { connect } from 'react-redux';
import { compose } from 'utils';
import DialogConnect from 'connectors/Dialog.connector';
import DialogReduxConnect from 'components/DialogReduxConnect';
import {getDialogPayload} from 'store/dashboard/dashboard.reducer';
import withExchangeRatesActions from 'containers/FinancialStatements/ExchangeRates/withExchangeRatesActions';
import withExchangeRates from 'containers/FinancialStatements/ExchangeRates/withExchangeRates';  
import CurrencyFromDialogConnect from 'connectors/CurrencyFromDialog.connect'

export const mapStateToProps = (state, props) => {
  const dialogPayload = getDialogPayload(state, 'exchangeRate-form');

  return {
    name: 'exchangeRate-form',
    payload: { action: 'new', id: null, ...dialogPayload },
    editExchangeRate:
      dialogPayload && dialogPayload.action === 'edit'
        ? state.exchangeRates.exchangeRates[dialogPayload.id]
        : {},
  };
};
const ExchangeRatesDialogConnect = connect(mapStateToProps);
export default compose(
  CurrencyFromDialogConnect,
  ExchangeRatesDialogConnect,
  withExchangeRatesActions,
  withExchangeRates(({ exchangeRatesList }) => ({
    exchangeRatesList
  })),
  DialogReduxConnect,
  DialogConnect
);