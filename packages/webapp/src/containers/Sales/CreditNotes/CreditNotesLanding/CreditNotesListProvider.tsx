import { isEmpty } from 'lodash';
import React from 'react';
import type { CreditNoteTableRow } from './components';
import { DashboardInsider } from '@/components/Dashboard';
import {
  useResourceViews,
  useResourceMeta,
  useCreditNotes,
  useRefreshCreditNotes,
  useSettingsCreditNotes,
} from '@/hooks/query';
import { getFieldsFromResourceMeta } from '@/utils';
import type { IResourceField } from '@/components/AdvancedFilter/interfaces';
import type { SettingsGroup } from '@bigcapital/sdk-ts';

interface CreditNotesListProviderProps {
  query?: any;
  tableStateChanged?: boolean;
  children?: React.ReactNode;
}

export interface CreditNotesListContextValue {
  creditNotes: CreditNoteTableRow[] | undefined;
  pagination: { total?: number; [key: string]: any } | undefined;
  CreditNotesView: any;
  refresh: () => void;
  resourceMeta: any;
  fields: IResourceField[];
  isResourceLoading: boolean;
  isResourceFetching: boolean;
  isCreditNotesFetching: boolean;
  isCreditNotesLoading: boolean;
  isViewsLoading: boolean;
  isEmptyStatus: boolean;
  creditNoteSettings: SettingsGroup | undefined;
}

const CreditNoteListContext = React.createContext<CreditNotesListContextValue>(
  {} as CreditNotesListContextValue,
);

function CreditNotesListProvider({
  query,
  tableStateChanged,
  ...props
}: CreditNotesListProviderProps) {
  const { refresh } = useRefreshCreditNotes();

  const { data: CreditNotesView, isLoading: isViewsLoading } =
    useResourceViews('credit_notes');

  const {
    data: resourceMeta,
    isLoading: isResourceLoading,
    isFetching: isResourceFetching,
  } = useResourceMeta('credit_notes');

  const {
    data: creditNotesData,
    isFetching: isCreditNotesFetching,
    isLoading: isCreditNotesLoading,
  } = useCreditNotes(query);

  const { data: creditNoteSettings } = useSettingsCreditNotes();

  const isEmptyStatus =
    isEmpty(creditNotesData?.data) &&
    !isCreditNotesLoading &&
    !tableStateChanged;

  const provider: CreditNotesListContextValue = {
    creditNotes: creditNotesData?.data,
    pagination: creditNotesData?.pagination,

    CreditNotesView,
    refresh,

    resourceMeta,
    fields: resourceMeta?.fields
      ? getFieldsFromResourceMeta(resourceMeta.fields)
      : [],
    isResourceLoading,
    isResourceFetching,

    isCreditNotesFetching,
    isCreditNotesLoading,
    isViewsLoading,
    isEmptyStatus,

    creditNoteSettings,
  };

  return (
    <DashboardInsider
      loading={isViewsLoading || isResourceLoading}
      name={'credit-notes-list'}
    >
      <CreditNoteListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useCreditNoteListContext = () => React.useContext(CreditNoteListContext);

export { CreditNotesListProvider, useCreditNoteListContext };
