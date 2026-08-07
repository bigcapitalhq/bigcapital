import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { CLOSE_DRAWER, OPEN_DRAWER } from '@/store/types';

export interface WithDrawerActionsProps {
  openDrawer: (name: string, payload?: Record<string, unknown>) => void;
  closeDrawer: (name: string, payload?: Record<string, unknown>) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithDrawerActionsProps => ({
  openDrawer: (name, payload) => dispatch({ type: OPEN_DRAWER, name, payload }),
  closeDrawer: (name, payload) =>
    dispatch({ type: CLOSE_DRAWER, name, payload }),
});

export function withDrawerActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithDrawerActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithDrawerActionsProps>
  >;
}
