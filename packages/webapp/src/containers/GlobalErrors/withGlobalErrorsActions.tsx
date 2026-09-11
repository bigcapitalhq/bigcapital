import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { ComponentType } from 'react';
import { setGlobalErrors } from '@/store/global-errors/global-errors.actions';

export interface WithGlobalErrorsActionsProps {
  globalErrorsSet: (errors: Record<string, unknown>) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithGlobalErrorsActionsProps => ({
  globalErrorsSet: (errors: Record<string, unknown>) =>
    dispatch(setGlobalErrors(errors)),
});

export function withGlobalErrorsActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithGlobalErrorsActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithGlobalErrorsActionsProps>
  >;
}
