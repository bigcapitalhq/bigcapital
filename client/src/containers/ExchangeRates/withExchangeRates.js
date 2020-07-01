import { connect } from 'react-redux';
import { getExchangeRatesList } from 'store/ExchangeRate/exchange.selector';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      exchangeRatesList: getExchangeRatesList(state, props),
      exchangeRatesLoading: state.exchangeRates.loading,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
