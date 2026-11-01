import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import type { RootState } from '@/store/reducers';
import { setOrganizationSetupCompleted } from '@/store/organizations/organizations.actions';

export interface WithOrganizationActionsProps {
  setOrganizationSetupCompleted: (congrats: boolean) => void;
}

export const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>,
): WithOrganizationActionsProps => ({
  setOrganizationSetupCompleted: (congrats) =>
    dispatch(setOrganizationSetupCompleted(congrats)),
});

export function withOrganizationActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithOrganizationActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithOrganizationActionsProps>
  >;
}
