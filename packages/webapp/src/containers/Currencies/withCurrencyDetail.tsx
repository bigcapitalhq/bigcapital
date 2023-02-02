// @ts-nocheck
import { connect } from 'react-redux';
import { getCurrencyByCode } from '@/store/currencies/currencies.selector';

const mapStateToProps = (state, props) => ({
  currency: getCurrencyByCode(state, props),
});

export default connect(mapStateToProps);
