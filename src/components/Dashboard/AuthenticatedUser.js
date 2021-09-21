import React from 'react';
import { useUser } from 'hooks/query';
import withAuthentication from '../../containers/Authentication/withAuthentication';

const AuthenticatedUserContext = React.createContext();

function AuthenticatedUserComponent({ authenticatedUserId, children }) {
  const { data: user, ...restProps } = useUser(authenticatedUserId);

  return (
    <AuthenticatedUserContext.Provider
      value={{
        user,
        ...restProps,
      }}
      children={children}
    />
  );
}

export const AuthenticatedUser = withAuthentication(
  ({ authenticatedUserId }) => ({
    authenticatedUserId,
  }),
)(AuthenticatedUserComponent);

export const useAuthenticatedUser = () =>
  React.useContext(AuthenticatedUserContext);
