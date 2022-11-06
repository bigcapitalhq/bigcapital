// @ts-nocheck

import { connect } from 'react-redux';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      sidebarSubmenuOpen: state.dashboard.sidebarSubmenu.isOpen,
      sidebarSubmenuId: state.dashboard.sidebarSubmenu.submenuId,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
}
