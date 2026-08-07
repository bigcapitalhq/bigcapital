import { useSelector } from 'react-redux';
import { selectIsOrganizationCongrats } from '@/store/organizations/organizations.selectors';

/**
 * Whether the current organization's setup "congrats" step has been reached.
 * Client-only flag set after the build job completes (see `setOrganizationSetupCompleted`).
 */
export const useIsOrganizationSetupCompleted = () =>
  useSelector(selectIsOrganizationCongrats);
