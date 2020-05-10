import { connect } from 'react-redux';
import {
  getCurrencyById,
  getCurrencyByCode,
} from 'store/currencies/currencies.selector';


const mapStateToProps = (state, props) => ({
  ...(props.currencyId) ? {
    currency: getCurrencyById(state.currencies.data, props.currencyId),
  } : (props.currencyCode) ? {
    currency: getCurrencyByCode(state.currencies.data, props.currencyCode),
  } : {},
});

export default connect(mapStateToProps);