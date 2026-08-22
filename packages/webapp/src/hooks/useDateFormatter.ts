import { useCurrentOrganizationMetadata } from '@/hooks/query';
import { momentFormatter } from '@/utils';

/**
 * Retrieves a date formatter configuration bound to the organization's
 * selected date format, used to display/parse dates in date inputs.
 */
export function useDateFormatter() {
  const metadata = useCurrentOrganizationMetadata();
  const dateFormat = metadata?.dateFormat ?? 'DD MMM YYYY';

  return momentFormatter(dateFormat);
}
