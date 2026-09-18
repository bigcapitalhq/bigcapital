import {
  applyAccountsTemplate,
  fetchAccountsTemplates,
  previewAccountsTemplate,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { accountsKeys } from '../accounts/query-keys';
import { cashflowAccountsKeys } from '../cashflow-accounts/query-keys';
import { financialReportsKeys } from '../FinancialReports/query-keys';
import { ACCOUNTS_TEMPLATE_PREVIEW, accountsTemplatesKeys } from './query-keys';
import type {
  AccountsTemplate,
  AccountsTemplatePlan,
  AccountsTemplateSelection,
} from '@bigcapital/sdk-ts';

export function useAccountsTemplates(
  props?: Omit<UseQueryOptions<AccountsTemplate[]>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: accountsTemplatesKeys.list(),
    queryFn: () => fetchAccountsTemplates(fetcher),
  });
}

/**
 * Previews what applying the template would change. Writes nothing.
 */
export function useAccountsTemplatePreview(
  selection: Partial<AccountsTemplateSelection>,
  props?: Omit<UseQueryOptions<AccountsTemplatePlan>, 'queryKey' | 'queryFn'>,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });
  const { templateKey, variant } = selection;

  return useQuery({
    ...props,
    queryKey: accountsTemplatesKeys.preview(templateKey, variant),
    queryFn: () =>
      previewAccountsTemplate(fetcher, { templateKey: templateKey!, variant }),
    enabled: Boolean(templateKey) && (props?.enabled ?? true),
  });
}

export function useApplyAccountsTemplate(
  props?: UseMutationOptions<
    AccountsTemplatePlan,
    Error,
    AccountsTemplateSelection
  >,
) {
  const client = useQueryClient();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: (selection: AccountsTemplateSelection) =>
      applyAccountsTemplate(fetcher, selection),
    onSettled: () => {
      // Accounts are renumbered, renamed, added and removed, so everything
      // that lists them is stale; so is any preview taken before.
      client.invalidateQueries({ queryKey: accountsKeys.all() });
      client.invalidateQueries({ queryKey: cashflowAccountsKeys.all() });
      client.invalidateQueries({ queryKey: financialReportsKeys.all() });
      client.invalidateQueries({ queryKey: [ACCOUNTS_TEMPLATE_PREVIEW] });
    },
  });
}
