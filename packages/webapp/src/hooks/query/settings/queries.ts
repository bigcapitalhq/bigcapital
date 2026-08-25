import {
  fetchSettingsGrouped,
  fetchSettingsInvoices,
  fetchSettingsEstimates,
  fetchSettingsPaymentReceives,
  fetchSettingsReceipts,
  fetchSettingsManualJournals,
  fetchSettingsItems,
  fetchSettingsItemCategories,
  fetchSettingCashFlow,
  fetchSettingsCreditNotes,
  fetchSettingsVendorCredits,
  fetchSettingsWarehouseTransfers,
  fetchSettingsBills,
  fetchSettingsBillPayments,
  fetchSettingsOrganization,
  fetchSettingsExpenses,
  fetchSettingsAccounts,
  fetchSettingsCustomers,
  fetchSettingsVendors,
  fetchSettingsCashflowTransactions,
  fetchSettingsProjects,
  fetchSettingsProjectTasks,
  fetchSettingsTimesheets,
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
import type {
  AllSettings,
  SaveSettingsBody,
  SettingsGroup,
} from '@bigcapital/sdk-ts';

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
  props?: Omit<UseQueryOptions<AllSettings>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: settingsKeys.all(),
    queryFn: () => fetchSettingsGrouped(fetcher),
  });
}

type GroupQueryOptions = Omit<
  UseQueryOptions<SettingsGroup>,
  'queryKey' | 'queryFn'
>;

export function useSettingsInvoices(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.invoices(),
    queryFn: () => fetchSettingsInvoices(fetcher),
  });
}

export function useSettingsEstimates(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.estimates(),
    queryFn: () => fetchSettingsEstimates(fetcher),
  });
}

export function useSettingsPaymentReceives(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.paymentReceives(),
    queryFn: () => fetchSettingsPaymentReceives(fetcher),
  });
}

export function useSettingsReceipts(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.receipts(),
    queryFn: () => fetchSettingsReceipts(fetcher),
  });
}

export function useSettingsManualJournals(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.manualJournals(),
    queryFn: () => fetchSettingsManualJournals(fetcher),
  });
}

export function useSettingsItems(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.items(),
    queryFn: () => fetchSettingsItems(fetcher),
  });
}

export function useSettingsItemCategories(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.itemCategories(),
    queryFn: () => fetchSettingsItemCategories(fetcher),
  });
}

export function useSettingCashFlow(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.cashflow(),
    queryFn: () => fetchSettingCashFlow(fetcher),
  });
}

export function useSettingsCreditNotes(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.creditNotes(),
    queryFn: () => fetchSettingsCreditNotes(fetcher),
  });
}

export function useSettingsVendorCredits(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.vendorCredits(),
    queryFn: () => fetchSettingsVendorCredits(fetcher),
  });
}

export function useSettingsWarehouseTransfers(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.warehouseTransfers(),
    queryFn: () => fetchSettingsWarehouseTransfers(fetcher),
  });
}

export function useSettingsBills(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.bills(),
    queryFn: () => fetchSettingsBills(fetcher),
  });
}

export function useSettingsBillPayments(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.billPayments(),
    queryFn: () => fetchSettingsBillPayments(fetcher),
  });
}

export function useSettingsOrganization(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.organization(),
    queryFn: () => fetchSettingsOrganization(fetcher),
  });
}

export function useSettingsExpenses(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.expenses(),
    queryFn: () => fetchSettingsExpenses(fetcher),
  });
}

export function useSettingsAccounts(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.accounts(),
    queryFn: () => fetchSettingsAccounts(fetcher),
  });
}

export function useSettingsCustomers(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.customers(),
    queryFn: () => fetchSettingsCustomers(fetcher),
  });
}

export function useSettingsVendors(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.vendors(),
    queryFn: () => fetchSettingsVendors(fetcher),
  });
}

export function useSettingsCashflowTransactions(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.cashflowTransactions(),
    queryFn: () => fetchSettingsCashflowTransactions(fetcher),
  });
}

export function useSettingsProjects(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.projects(),
    queryFn: () => fetchSettingsProjects(fetcher),
  });
}

export function useSettingsProjectTasks(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.projectTasks(),
    queryFn: () => fetchSettingsProjectTasks(fetcher),
  });
}

export function useSettingsTimesheets(props?: GroupQueryOptions) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  return useQuery({
    ...props,
    queryKey: settingsKeys.timesheets(),
    queryFn: () => fetchSettingsTimesheets(fetcher),
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
