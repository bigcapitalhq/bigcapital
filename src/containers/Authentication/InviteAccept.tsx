// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';
import InviteAcceptForm from './InviteAcceptForm';
import AuthInsider from '@/containers/Authentication/AuthInsider';
import { InviteAcceptProvider } from './InviteAcceptProvider';

/**
 * Authentication invite page.
 */
export default function Invite() {
  const { token } = useParams();

  return (
    <AuthInsider>
      <InviteAcceptProvider token={token}>
        <InviteAcceptForm />
      </InviteAcceptProvider>
    </AuthInsider>
  );
}
