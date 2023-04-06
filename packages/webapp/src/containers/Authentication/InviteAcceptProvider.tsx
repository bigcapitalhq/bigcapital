// @ts-nocheck
import React, { createContext, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useInviteMetaByToken, useAuthInviteAccept } from '@/hooks/query';
import { InviteAcceptLoading } from './components';

const InviteAcceptContext = createContext();

/**
 * Invite accept provider.
 */
function InviteAcceptProvider({ token, ...props }) {
  // Invite meta by token.
  const {
    data: inviteMeta,
    error: inviteMetaError,
    isError: isInviteMetaError,
    isFetching: isInviteMetaLoading,
  } = useInviteMetaByToken(token, { retry: false });

  // Invite accept mutate.
  const { mutateAsync: inviteAcceptMutate } = useAuthInviteAccept({
    retry: false,
  });
  // History context.
  const history = useHistory();

  useEffect(() => {
    if (inviteMetaError) { history.push('/auth/login'); }
  }, [history, inviteMetaError]);

  // Provider payload.
  const provider = {
    token,
    inviteMeta,
    inviteMetaError,
    isInviteMetaError,
    isInviteMetaLoading,
    inviteAcceptMutate
  };

  if (inviteMetaError) {
    return null;
  }

  return (
    <InviteAcceptLoading isLoading={isInviteMetaLoading}>
      { isInviteMetaError }
      <InviteAcceptContext.Provider value={provider} {...props} />
    </InviteAcceptLoading>
  );
}

const useInviteAcceptContext = () => useContext(InviteAcceptContext);

export { InviteAcceptProvider, useInviteAcceptContext };
