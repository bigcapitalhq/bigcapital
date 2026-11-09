import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { CLOSE_ALERT, OPEN_ALERT } from '@/store/types';

export interface WithAlertActionsProps {
  openAlert: (name: string, payload?: Record<string, unknown>) => void;
  closeAlert: (name: string, payload?: Record<string, unknown>) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithAlertActionsProps => ({
  openAlert: (name, payload) => dispatch({ type: OPEN_ALERT, name, payload }),
  closeAlert: (name, payload) => dispatch({ type: CLOSE_ALERT, name, payload }),
});

export function withAlertActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithAlertActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithAlertActionsProps>
  >;
}
