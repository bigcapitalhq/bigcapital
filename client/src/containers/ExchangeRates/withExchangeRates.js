import { connect } from 'react-redux';
import {
  getExchangeRatesList,
  getExchangeRatePaginationMetaFactory,
  getExchangeRatesTableQueryFactory,
} from 'store/ExchangeRate/exchange.selector';

export default (mapState) => {
  const getExchangeRatesPaginationMeta = getExchangeRatePaginationMetaFactory();

  const mapStateToProps = (state, props) => {
    const query = getExchangeRatesTableQueryFactory(state, props);

    const mapped = {
      exchangeRatesList: getExchangeRatesList(state, props),
      exchangeRatesLoading: state.exchangeRates.loading,
      exchangeRatesPageination: getExchangeRatesPaginationMeta(
        state,
        props,
        query,
      ),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
