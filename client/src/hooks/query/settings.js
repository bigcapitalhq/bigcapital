import { useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useQueryTenant } from '../useQueryTenant';
import { useDispatch } from 'react-redux';
import useApiRequest from '../useRequest';
import t from 'store/types';

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
  const dispatch = useDispatch();
  const apiRequest = useApiRequest();

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
    if (typeof state.data !== 'undefined') {
      dispatch({ type: t.SETTING_SET, options: state.data });
    }
  }, [state.data, dispatch]);

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