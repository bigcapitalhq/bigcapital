import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  closeSidebarSubmenu,
  openSidebarSubmenu,
} from '@/store/dashboard/dashboard.actions';

export interface WithDashboardSidebarActionsProps {
  openDashboardSidebarSubmenu: (submenuId: string) => void;
  closeDashboardSidebarSubmenu: () => void;
}

const mapActionsToProps = (
  dispatch: Dispatch,
): WithDashboardSidebarActionsProps => ({
  openDashboardSidebarSubmenu: (submenuId) =>
    dispatch(openSidebarSubmenu({ submenuId })),
  closeDashboardSidebarSubmenu: () => dispatch(closeSidebarSubmenu()),
});

export function withDashboardSidebarActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithDashboardSidebarActionsProps>> {
  const Connected = connect(
    null,
    mapActionsToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithDashboardSidebarActionsProps>
  >;
}
