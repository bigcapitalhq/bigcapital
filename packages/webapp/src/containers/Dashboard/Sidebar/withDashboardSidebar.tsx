import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { ApplicationState } from '@/store/reducers';

export interface WithDashboardSidebarProps {
  sidebarSubmenuOpen: boolean;
  sidebarSubmenuId: unknown;
}

export function withDashboardSidebar<
  Props = unknown,
  Mapped extends object = WithDashboardSidebarProps,
>(mapState?: MapState<WithDashboardSidebarProps, Props, Mapped>) {
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
  return function withHOC<P>(
    WrappedComponent: ComponentType<P>,
  ): ComponentType<Omit<P, keyof Mapped>> {
    const Connected = connect(mapStateToProps)(
      WrappedComponent as ComponentType<any>,
    );
    return Connected as unknown as ComponentType<Omit<P, keyof Mapped>>;
  };
}
