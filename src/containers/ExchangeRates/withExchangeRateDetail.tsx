// @ts-nocheck
import { connect } from 'react-redux';
import { getExchangeRateById } from '@/store/ExchangeRate/exchange.selector';

const mapStateToProps = (state, props) => ({
  exchangeRate: getExchangeRateById(state, props),
});

export default connect(mapStateToProps);
