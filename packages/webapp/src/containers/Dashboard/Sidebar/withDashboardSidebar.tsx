import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { ApplicationState } from '@/store/reducers';

export interface WithDashboardSidebarProps {
  sidebarSubmenuOpen: boolean;
  sidebarSubmenuId: unknown;
}

export function withDashboardSidebar<Props = unknown>(
  mapState?: MapState<WithDashboardSidebarProps, Props>,
) {
  const mapStateToProps: MapStateToProps<
    WithDashboardSidebarProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const submenu = state.dashboard.sidebarSubmenu;
    const mapped: WithDashboardSidebarProps = {
      sidebarSubmenuOpen: submenu.isOpen,
      sidebarSubmenuId: submenu.submenuId,
    };
    return mapState
      ? ({
          ...mapped,
          ...mapState(mapped, state, props),
        } as WithDashboardSidebarProps)
      : mapped;
  };
  return connect(mapStateToProps);
}
