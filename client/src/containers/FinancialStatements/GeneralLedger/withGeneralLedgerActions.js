import {connect} from 'react-redux';
import {
  fetchGeneralLedger,
} from 'store/financialStatement/financialStatements.actions';

const mapDispatchToProps = (dispatch) => ({
  fetchGeneralLedger: (query = {}) => dispatch(fetchGeneralLedger({ query })),
});

export default connect(null, mapDispatchToProps);