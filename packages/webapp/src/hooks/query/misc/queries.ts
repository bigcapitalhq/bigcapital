import { fetchDateFormats } from '@bigcapital/sdk-ts';
import { useQuery } from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { miscKeys } from './query-keys';

/**
 * Retrieve the job metadata.
 */
export function useDateFormats(props = {}) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: miscKeys.dateFormats(),
    queryFn: () => fetchDateFormats(fetcher),
  });
}
