import { useParams } from 'react-router-dom';
import { InviteAcceptForm } from './InviteAcceptForm';
import { InviteAcceptProvider } from './InviteAcceptProvider';
import { AuthInsider } from '@/containers/Authentication/AuthInsider';

/**
 * Authentication invite page.
 */
export function Invite() {
  const { token } = useParams<{ token: string }>();

  return (
    <AuthInsider>
      <InviteAcceptProvider token={token}>
        <InviteAcceptForm />
      </InviteAcceptProvider>
    </AuthInsider>
  );
}
