import { connect } from 'react-redux';
import { getResourceViews } from 'store/customViews/customViews.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      exchangeRatesList: Object.values(state.exchangeRates.exchangeRates),
      exchangeRatesLoading: state.exchangeRates.loading,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
