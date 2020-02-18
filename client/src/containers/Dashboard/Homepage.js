import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import t from 'store/types';

const DashboardHomepage = ({ changePageTitle }) => {
  useEffect(() => {
    changePageTitle('Homepage')
  });
  return (
    <div>asdasd</div>
  );
}

const mapActionsToProps = (dispatch) => ({
  changePageTitle: pageTitle => dispatch({
    type: t.CHANGE_DASHBOARD_PAGE_TITLE, pageTitle
  }),
});
export default connect(null, mapActionsToProps)(DashboardHomepage);