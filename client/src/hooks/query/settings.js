import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import useApiRequest from '../useRequest';
import t from 'store/types';

/**
 * Retrieve settings.
 */
export function useSettings(query, props) {
  const dispatch = useDispatch();
  const apiRequest = useApiRequest();

  const settings = useQuery(
    ['SETTINGS', query],
    async () => {
      const {
        data: { settings },
      } = await apiRequest.get('settings', { params: query });

      return settings;
    },
    {
      initialData: [],
      ...props,
    },
  );
  dispatch({
    type: t.SETTING_SET,
    options: settings.data,
  });
  return settings;
}

/**
 * Saves the settings.
 */
export function useSaveSettings(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((settings) => apiRequest.post('settings', settings), {
    onSuccess: () => {
      queryClient.invalidateQueries('SETTINGS');
    },
    ...props,
  });
}
