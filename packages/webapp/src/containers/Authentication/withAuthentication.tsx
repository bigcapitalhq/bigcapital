import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { isAuthenticated } from '@/store/authentication/authentication.reducer';
import { ApplicationState } from '@/store/reducers';

export interface WithAuthenticationProps {
  isAuthorized: boolean;
  authenticatedUserId: string | null;
  currentOrganizationId: string | null;
}

export function withAuthentication<Props>(
  mapState?: MapState<WithAuthenticationProps, Props>,
) {
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
  return connect(mapStateToProps);
}
