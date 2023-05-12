// @ts-nocheck
import { connect } from 'react-redux';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      allSettings: state.settings.data,
      organizationSettings: state.settings.data.organization,
      manualJournalsSettings: state.settings.data.manualJournals,
      billPaymentSettings: state.settings.data.billPayments,
      billsettings: state.settings.data.bills,
      paymentReceiveSettings: state.settings.data.paymentReceives,
      estimatesSettings: state.settings.data.salesEstimates,
      receiptSettings: state.settings.data.salesReceipts,
      invoiceSettings: state.settings.data.salesInvoices,
      itemsSettings: state.settings.data.items,
      expenseSettings: state.settings.data.expenses,
      accountsSettings: state.settings.data.accounts,
      customersSettings: state.settings.data.customers,
      vendorsSettings: state.settings.data.vendors,
      cashflowSettings: state.settings.data.cashflowAccounts,
      cashflowTransactionsSettings: state.settings.data.cashflowTransactions,
      cashflowSetting: state.settings.data.cashflow,
      creditNoteSettings: state.settings.data.creditNote,
      vendorsCreditNoteSetting: state.settings.data.vendorCredit,
      warehouseTransferSettings: state.settings.data.warehouseTransfers,
      projectSettings:state.settings.data.projects,
      projectTasksSettings:state.settings.data.projectTasks,
      timesheetsSettings:state.settings.data.timesheets
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
