import { useMemo } from 'react';
import { useAppQueryString } from '@/hooks';
import {
  useSuspenseOrganizationAccountingBasis,
  type AccountingBasis,
} from '@/hooks/query/settings';

export function useAccountingReportQuery<T>(
  parseQuery: (
    locationQuery: Record<string, unknown>,
    basis: AccountingBasis,
  ) => T,
) {
  const organizationBasis = useSuspenseOrganizationAccountingBasis();
  const [locationQuery, setLocationQuery] = useAppQueryString();
  const query = useMemo(
    () => parseQuery(locationQuery, organizationBasis),
    [locationQuery, organizationBasis, parseQuery],
  );
  return { query, locationQuery, setLocationQuery };
}
