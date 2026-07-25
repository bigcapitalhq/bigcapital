import { isEmpty } from 'lodash';
import React, { createContext } from 'react';
import type { ManualJournalTableRow } from './components';
import type {
  ManualJournalsListQuery,
  SettingsGroup,
} from '@bigcapital/sdk-ts';
import { DashboardInsider } from '@/components';
import {
  useResourceViews,
  useResourceMeta,
  useJournals,
  useSettingsManualJournals,
} from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';
import type { IResourceField } from '@/components/AdvancedFilter/interfaces';

// FIXME: SDK schema declares the manual-journals list endpoint as returning
// `ManualJournalResponseDto[]`, but the server actually returns a paginated
// `{ data, pagination }` envelope. Cast at the extraction site until the
// OpenAPI spec is corrected.
interface ManualJournalsRuntimeResponse {
  data?: ManualJournalTableRow[];
  pagination?: { total?: number; [key: string]: unknown };
}

interface ManualJournalsListProviderProps {
  query?: ManualJournalsListQuery | null;
  tableStateChanged?: boolean;
  children?: React.ReactNode;
}

export interface ManualJournalsContextValue {
  manualJournals: ManualJournalTableRow[] | undefined;
  pagination: { total?: number; [key: string]: unknown } | undefined;
  // `ResourceViewResponse` is a complex SDK union; consumers only `.map`/`.find`
  // on it, so we surface it as `any` (matches InvoicesListProvider pattern).
  journalsViews: any;
  resourceMeta: any;
  fields: IResourceField[];
  isManualJournalsLoading: boolean;
  isManualJournalsFetching: boolean;
  isViewsLoading: boolean;
  isEmptyStatus: boolean;

  manualJournalsSettings: SettingsGroup | undefined;
}

const ManualJournalsContext = createContext<ManualJournalsContextValue>(
  {} as ManualJournalsContextValue,
);

function ManualJournalsListProvider({
  query,
  tableStateChanged,
  ...props
}: ManualJournalsListProviderProps) {
  // Fetches accounts resource views and fields.
  const { data: journalsViews, isLoading: isViewsLoading } =
    useResourceViews('manual_journals');

  // Manual journals settings.
  const { data: manualJournalsSettings } = useSettingsManualJournals();

  // Fetches the manual journals transactions with pagination meta.
  const {
    data: manualJournalsDataRaw,
    isLoading: isManualJournalsLoading,
    isFetching: isManualJournalsFetching,
  } = useJournals(query);
  const manualJournalsData = manualJournalsDataRaw as unknown as
    | ManualJournalsRuntimeResponse
    | undefined;

  // Fetch the accounts resource fields.
  const { data: resourceMeta, isLoading: isResourceMetaLoading } =
    useResourceMeta('manual_journals');

  // Detarmines the datatable empty status.
  const isEmptyStatus =
    isEmpty(manualJournalsData?.data) &&
    !tableStateChanged &&
    !isManualJournalsLoading;

  // Global state.
  const state: ManualJournalsContextValue = {
    manualJournals: manualJournalsData?.data,
    pagination: manualJournalsData?.pagination,
    journalsViews,

    resourceMeta,
    fields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(resourceMeta.fields)
      : [],

    isManualJournalsLoading,
    isManualJournalsFetching,
    isViewsLoading,

    isEmptyStatus,

    manualJournalsSettings,
  };

  const isPageLoading = isViewsLoading || isResourceMetaLoading;

  return (
    <DashboardInsider loading={isPageLoading} name={'manual-journals'}>
      <ManualJournalsContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const useManualJournalsContext = () => React.useContext(ManualJournalsContext);

export { ManualJournalsListProvider, useManualJournalsContext };
