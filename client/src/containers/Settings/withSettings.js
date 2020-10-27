import { connect } from 'react-redux';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      organizationSettings: state.settings.data.organization,
      manualJournalsSettings: state.settings.data.manualJournals,
      billsettings: state.settings.data.bills,
      billPaymentSettings: state.settings.data.billPayments,
      estimatesSettings: state.settings.data.salesEstimates,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
