// @ts-nocheck
import { connect } from 'react-redux';
import {
  closeSidebarSubmenu,
  openSidebarSubmenu,
} from '@/store/dashboard/dashboard.actions';

const mapActionsToProps = (dispatch) => ({
  // Opens the dashboard submenu sidebar.
  openDashboardSidebarSubmenu: (submenuId) =>
    dispatch(openSidebarSubmenu(submenuId)),

  // Closes the dashboard submenu sidebar.
  closeDashboardSidebarSubmenu: () => dispatch(closeSidebarSubmenu()),
});

export default connect(null, mapActionsToProps);
