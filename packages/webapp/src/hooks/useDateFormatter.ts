import { useOrganizationMeta } from '@/components/Organization/OrganizationMetaProvider';
import { momentFormatter } from '@/utils';

/**
 * Retrieves a date formatter configuration bound to the organization's
 * selected date format, used to display/parse dates in date inputs.
 */
export function useDateFormatter() {
  const metadata = useOrganizationMeta();
  const dateFormat = metadata?.dateFormat ?? 'DD MMM YYYY';

  return momentFormatter(dateFormat);
}
