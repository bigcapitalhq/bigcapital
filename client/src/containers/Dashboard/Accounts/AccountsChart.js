import React, { useEffect } from 'react';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import { connect } from 'react-redux';
import t from 'store/types';

function AccountsChart({ changePageTitle }) {  
  useEffect(() => {
    changePageTitle('Chart of Accounts');
  });
  return (
    <React.Fragment>
      <DashboardActionsBar />
      <DashboardPageContent>
      
      </DashboardPageContent>
    </React.Fragment>
  );
}

const mapActionsToProps = (dispatch) => ({
  changePageTitle: pageTitle => dispatch({
    type: t.CHANGE_DASHBOARD_PAGE_TITLE, pageTitle
  }),
});
export default connect(null, mapActionsToProps)(AccountsChart);