import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import type { ComponentType } from 'react';
import { isAuthenticated } from '@/store/authentication/authentication.reducer';
import { ApplicationState } from '@/store/reducers';

export interface WithAuthenticationProps {
  isAuthorized: boolean;
  authenticatedUserId: string | null;
  currentOrganizationId: string | null;
}

export function withAuthentication<
  Props,
  Mapped extends object = WithAuthenticationProps,
>(mapState?: MapState<WithAuthenticationProps, Props, Mapped>) {
  const mapStateToProps: MapStateToProps<
    WithAuthenticationProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithAuthenticationProps = {
      isAuthorized: isAuthenticated(state),
      authenticatedUserId: state.authentication.userId,
      currentOrganizationId: state.authentication?.organizationId,
    };
    return mapState
      ? (mapState(mapped, state, props) as WithAuthenticationProps)
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
