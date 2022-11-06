// @ts-nocheck
import { connect } from 'react-redux';
import { getCurrenciesList } from '@/store/currencies/currencies.selector';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      currencies: state.currencies.data,
      currenciesList: getCurrenciesList(state, props),
      currenciesLoading: state.currencies.loading,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
