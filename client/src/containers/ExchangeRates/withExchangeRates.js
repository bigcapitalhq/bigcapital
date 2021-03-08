import { connect } from 'react-redux';
import { getExchangeRatesTableStateFactory } from 'store/ExchangeRate/exchange.selector';

export default (mapState) => {
  const getExchangeRatesTableState = getExchangeRatesTableStateFactory();
  
  const mapStateToProps = (state, props) => {
    const mapped = {
      exchangeRatesTableState: getExchangeRatesTableState(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
