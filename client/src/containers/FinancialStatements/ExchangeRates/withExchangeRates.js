import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';

const mapStateToProps = (state, props) => ({
  exchangeRatesList: Object.values(state.exchangeRates.exchangeRates),
});

export default connect(mapStateToProps);
