import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import t from 'store/types';

const DashboardHomepage = ({ changePageTitle }) => {
  useEffect(() => {
    changePageTitle('Craig’s Design and Landscaping Services')
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