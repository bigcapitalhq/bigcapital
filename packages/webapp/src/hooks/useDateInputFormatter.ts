import { useMemo } from 'react';
import { useCurrentOrganizationMetadata } from '@/hooks/query';
import { momentFormatter } from '@/utils';

const DEFAULT_DATE_FORMAT = 'DD MMM YYYY';

/**
 * Returns the formatter props (`formatDate`, `parseDate`, `placeholder`) for
 * date inputs based on the current organization's configured date format.
 */
export function useDateInputFormatter() {
  const metadata = useCurrentOrganizationMetadata();
  const dateFormat = metadata?.dateFormat ?? DEFAULT_DATE_FORMAT;

  return useMemo(() => momentFormatter(dateFormat), [dateFormat]);
}
