import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import ApiService from 'services/ApiService';
import t from 'store/types';

/**
 * Retrieve settings.
 */
export function useSettings(query, props) {
  const dispatch = useDispatch();

  const settings = useQuery(
    ['SETTINGS', query],
    async () => {
      const {
        data: { settings },
      } = await ApiService.get('settings', { params: query });

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

  return useMutation((settings) => ApiService.post('settings', settings), {
    onSuccess: () => {
      queryClient.invalidateQueries('SETTINGS');
    },
    ...props,
  });
}
