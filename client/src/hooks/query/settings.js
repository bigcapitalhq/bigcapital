import { useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useQueryTenant } from '../useQueryTenant';
import useApiRequest from '../useRequest';
import { useSetSettings } from 'hooks/state';
import t from './types';

/**
 * Saves the settings.
 */
export function useSaveSettings(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((settings) => apiRequest.post('settings', settings), {
    onSuccess: () => {
      queryClient.invalidateQueries(t.SETTING);
    },
    ...props,
  });
}

function useSettingsQuery(key, query, props) {
  const apiRequest = useApiRequest();
  const setSettings = useSetSettings();

  const state = useQueryTenant(
    key,
    () => apiRequest.get('settings', { params: query }),
    {
      select: (res) => res.data.settings,
      initialDataUpdatedAt: 0,
      initialData: {
        data: {
          settings: [],
        },
      },
      ...props,
    },
  );

  useEffect(() => {
    if (state.isSuccess) {
      setSettings(state.data);
    }
  }, [state.data, state.isSuccess, setSettings]);

  return state.data;
}

/**
 * Retrieve the all settings of the organization.
 */
export function useSettings() {
  return useSettingsQuery([t.SETTING, 'ALL'], {});
}

/**
 * Retrieve invoices settings.
 */
export function useSettingsInvoices(props) {
  return useSettingsQuery(
    [t.SETTING, t.SETTING_INVOICES],
    { group: 'sale_invoices' },
    props,
  );
}

/**
 * Retrieve invoices settings.
 */
export function useSettingsEstimates(props) {
  return useSettingsQuery(
    [t.SETTING, t.SETTING_ESTIMATES],
    { group: 'sale_estimates' },
    props,
  );
}

/**
 * Retrieve payment receives settings.
 */
export function useSettingsPaymentReceives(props) {
  return useSettingsQuery(
    [t.SETTING, t.SETTING_PAYMENT_RECEIVES],
    { group: 'payment_receives' },
    props,
  );
}

/**
 * Retrieve sale receipts settings.
 * @param {*} props 
 */
export function useSettingsReceipts(props) {
  return useSettingsQuery(
    [t.SETTING, t.SETTING_RECEIPTS],
    { group: 'sale_receipts' },
    props,
  );
}

/**
 * Retrieve sale receipts settings.
 * @param {*} props 
 */
export function useSettingsManualJournals(props) {
  return useSettingsQuery(
    [t.SETTING, t.SETTING_MANUAL_JOURNALS],
    { group: 'sale_receipts' },
    props,
  );
}