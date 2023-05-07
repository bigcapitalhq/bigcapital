// @ts-nocheck
import React, { createContext } from 'react';
import { useAuthMetadata } from '@/hooks/query';
import { Spinner } from '@blueprintjs/core';
import styled from 'styled-components';

const AuthMetaBootContext = createContext();

/**
 * Boots the authentication page metadata.
 */
function AuthMetaBootProvider({ ...props }) {
  const { isLoading: isAuthMetaLoading, data: authMeta } = useAuthMetadata();

  const state = {
    isAuthMetaLoading,
    signupDisabled: authMeta?.meta?.signup_disabled,
  };

  if (isAuthMetaLoading) {
    return (
      <SpinnerRoot>
        <Spinner size={30} value={null} />
      </SpinnerRoot>
    );
  }
  return <AuthMetaBootContext.Provider value={state} {...props} />;
}

const useAuthMetaBoot = () => React.useContext(AuthMetaBootContext);

export { AuthMetaBootContext, AuthMetaBootProvider, useAuthMetaBoot };

const SpinnerRoot = styled.div`
  margin-top: 5rem;
`;
