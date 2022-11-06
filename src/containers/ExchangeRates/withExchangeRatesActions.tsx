// @ts-nocheck
import { connect } from 'react-redux';
import { setExchangeRateTableState } from '@/store/ExchangeRate/exchange.actions';

export const mapDispatchToProps = (dispatch) => ({
  setExchangeRateTableState: (queries) =>
    dispatch(setExchangeRateTableState(queries)),
});

export default connect(null, mapDispatchToProps);
