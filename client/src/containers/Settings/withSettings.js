import { connect } from 'react-redux';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      organizationSettings: state.settings.data.organization,
      manualJournalsSettings: state.settings.data.manual_journals,
      billsettings: state.settings.data.bills,
      billPaymentSettings: state.settings.data.bill_payments,
      estimatesSettings: state.settings.data.sales_estimates,
      receiptSettings: state.settings.data.sales_receipts,
      invoiceSettings: state.settings.data.sales_invoices,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
