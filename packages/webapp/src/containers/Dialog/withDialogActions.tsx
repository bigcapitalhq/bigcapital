import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ComponentType } from 'react';
import t from '@/store/types';

export interface WithDialogActionsProps {
  openDialog: (name: string, payload?: Record<string, unknown>) => void;
  closeDialog: (name: string, payload?: Record<string, unknown>) => void;
}

export const mapDispatchToProps = (dispatch: Dispatch): WithDialogActionsProps => ({
  openDialog: (name, payload) =>
    dispatch({ type: t.OPEN_DIALOG, name, payload }),
  closeDialog: (name, payload) =>
    dispatch({ type: t.CLOSE_DIALOG, name, payload }),
});

/**
 * HOC that injects dialog actions (openDialog, closeDialog) into a component.
 * Properly preserves the wrapped component's prop types while omitting injected props.
 */
function withDialogActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithDialogActionsProps>> {
  const Connected = connect(null, mapDispatchToProps)(
    WrappedComponent as ComponentType<any>,
  );
  return Connected as unknown as ComponentType<Omit<P, keyof WithDialogActionsProps>>;
}

export { withDialogActions };
