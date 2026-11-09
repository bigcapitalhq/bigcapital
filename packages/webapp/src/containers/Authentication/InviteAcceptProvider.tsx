import { createContext, ReactNode, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { InviteAcceptLoading } from './components';
import { useInviteMetaByToken, useAuthInviteAccept } from '@/hooks/query';

export interface InviteAcceptMeta {
  email?: string;
  organizationName?: string;
}

export interface InviteAcceptContextState {
  token: string;
  inviteMeta: InviteAcceptMeta | null;
  inviteMetaError: Error | null;
  isInviteMetaError: boolean;
  isInviteMetaLoading: boolean;
  inviteAcceptMutate: (
    values: [Record<string, unknown>, string],
  ) => Promise<unknown>;
}

export interface InviteAcceptProviderProps {
  token: string;
  children?: ReactNode;
}

interface InviteMetaResponse {
  inviteToken?: { email?: string };
  orgName?: string;
}

const InviteAcceptContext = createContext<InviteAcceptContextState | undefined>(
  undefined,
);

/**
 * Invite accept provider.
 */
function InviteAcceptProvider({ token, ...props }: InviteAcceptProviderProps) {
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
    if (inviteMetaError) {
      history.push('/auth/login');
    }
  }, [history, inviteMetaError]);

  // Transform the backend response to match frontend expectations.
  const inviteMetaData = inviteMeta as InviteMetaResponse | undefined;
  const transformedInviteMeta: InviteAcceptMeta | null = inviteMetaData
    ? {
        email: inviteMetaData.inviteToken?.email,
        organizationName: inviteMetaData.orgName,
      }
    : null;

  // Provider payload.
  const provider: InviteAcceptContextState = {
    token,
    inviteMeta: transformedInviteMeta,
    inviteMetaError,
    isInviteMetaError,
    isInviteMetaLoading,
    inviteAcceptMutate,
  };

  if (inviteMetaError) {
    return null;
  }

  return (
    <InviteAcceptLoading isLoading={isInviteMetaLoading}>
      <InviteAcceptContext.Provider value={provider} {...props} />
    </InviteAcceptLoading>
  );
}

const useInviteAcceptContext = (): InviteAcceptContextState => {
  const context = useContext(InviteAcceptContext);
  if (!context) {
    throw new Error(
      'useInviteAcceptContext must be used within an InviteAcceptProvider.',
    );
  }
  return context;
};

export { InviteAcceptProvider, useInviteAcceptContext };
