import { Authentication } from './Authentication';
import { EnsureAuthNotAuthenticated } from '@/components/Guards/EnsureAuthNotAuthenticated';

export function AuthenticationPage() {
  return (
    <EnsureAuthNotAuthenticated>
      <Authentication />
    </EnsureAuthNotAuthenticated>
  );
}
