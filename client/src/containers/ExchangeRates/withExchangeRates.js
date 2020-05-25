import { connect } from 'react-redux';

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
