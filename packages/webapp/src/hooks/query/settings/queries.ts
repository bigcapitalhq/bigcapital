import {
  fetchSettings,
  fetchSettingsInvoices,
  fetchSettingsEstimates,
  fetchSettingsPaymentReceives,
  fetchSettingsReceipts,
  fetchSettingsManualJournals,
  fetchSettingsItems,
  fetchSettingCashFlow,
  fetchSettingsCreditNotes,
  fetchSettingsVendorCredits,
  fetchSettingsWarehouseTransfers,
  fetchSettingSMSNotifications,
  fetchSettingSMSNotification,
  editSettingSMSNotification,
  editSettings,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { settingsKeys } from './query-keys';
import type { SaveSettingsBody, SettingsResponse } from '@bigcapital/sdk-ts';

export function useSaveSettings(
  props?: UseMutationOptions<void, Error, SaveSettingsBody>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();
  return useMutation({
    ...props,
    mutationFn: (values: SaveSettingsBody) => editSettings(fetcher, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all() });
    },
  });
}

export function useSettings(
  props?: Omit<UseQueryOptions<SettingsResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: settingsKeys.all(),
    queryFn: () => fetchSettings(fetcher),
  });
}

export function useSettingsInvoices(
  props?: Omit<UseQueryOptions<SettingsResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: settingsKeys.invoices(),
    queryFn: () => fetchSettingsInvoices(fetcher),
  });
}

export function useSettingsEstimates(
  props?: Omit<UseQueryOptions<SettingsResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: settingsKeys.estimates(),
    queryFn: () => fetchSettingsEstimates(fetcher),
  });
}

export function useSettingsPaymentReceives(
  props?: Omit<UseQueryOptions<SettingsResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: settingsKeys.paymentReceives(),
    queryFn: () => fetchSettingsPaymentReceives(fetcher),
  });
}

export function useSettingsReceipts(
  props?: Omit<UseQueryOptions<SettingsResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: settingsKeys.receipts(),
    queryFn: () => fetchSettingsReceipts(fetcher),
  });
}

export function useSettingsManualJournals(
  props?: Omit<UseQueryOptions<SettingsResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: settingsKeys.manualJournals(),
    queryFn: () => fetchSettingsManualJournals(fetcher),
  });
}
export function useSettingsItems(
  props?: Omit<UseQueryOptions<SettingsResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: settingsKeys.items(),
    queryFn: () => fetchSettingsItems(fetcher),
  });
}

export function useSettingCashFlow(
  props?: Omit<UseQueryOptions<SettingsResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: settingsKeys.cashflow(),
    queryFn: () => fetchSettingCashFlow(fetcher),
  });
}

export function useSettingsCreditNotes(
  props?: Omit<UseQueryOptions<SettingsResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: settingsKeys.creditNotes(),
    queryFn: () => fetchSettingsCreditNotes(fetcher),
  });
}

export function useSettingsVendorCredits(
  props?: Omit<UseQueryOptions<SettingsResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: settingsKeys.vendorCredits(),
    queryFn: () => fetchSettingsVendorCredits(fetcher),
  });
}

export function useSettingsWarehouseTransfers(
  props?: Omit<UseQueryOptions<SettingsResponse>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: settingsKeys.warehouseTransfers(),
    queryFn: () => fetchSettingsWarehouseTransfers(fetcher),
  });
}

export function useSettingSMSNotifications(
  props?: Omit<UseQueryOptions<unknown>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: settingsKeys.smsNotifications(),
    queryFn: () => fetchSettingSMSNotifications(fetcher),
  });
}

export function useSettingSMSNotification(
  key: string,
  props?: Omit<UseQueryOptions<unknown>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: settingsKeys.smsNotification(key),
    queryFn: () => fetchSettingSMSNotification(fetcher, key),
    enabled: !!key,
  });
}

export function useSettingEditSMSNotification(
  props?: UseMutationOptions<
    unknown,
    Error,
    { key: string; values: Record<string, unknown> }
  >,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher();

  return useMutation({
    ...props,
    mutationFn: ({
      key,
      values,
    }: {
      key: string;
      values: Record<string, unknown>;
    }) => editSettingSMSNotification(fetcher, key, values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: settingsKeys.smsNotifications(),
      });
    },
  });
}
