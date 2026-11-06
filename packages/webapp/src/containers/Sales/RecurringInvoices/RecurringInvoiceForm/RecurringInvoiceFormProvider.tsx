import { createContext, useContext } from 'react';
import type {
  CreateRecurringInvoiceBody,
  EditRecurringInvoiceBody,
} from '@bigcapital/sdk-ts';
import type { ReactNode } from 'react';
import { DashboardInsider } from '@/components';
import { Features } from '@/constants';
import {
  useCreateRecurringInvoice,
  useCustomers,
  useEditRecurringInvoice,
  useItems,
  useRecurringInvoice,
  useRecurringInvoiceState,
  useTaxRates,
} from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

type RecurringInvoiceFormContextValue = {
  recurringInvoice: any;
  customers: any[];
  items: any[];
  taxRates: any[];
  state: any;
  isNewMode: boolean;
  isLoading: boolean;
  createRecurringInvoice: (values: CreateRecurringInvoiceBody) => Promise<any>;
  editRecurringInvoice: (
    values: [number, EditRecurringInvoiceBody],
  ) => Promise<any>;
};

const RecurringInvoiceFormContext = createContext<
  RecurringInvoiceFormContextValue | undefined
>(undefined);

export function RecurringInvoiceFormProvider({
  recurringInvoiceId,
  children,
}: {
  recurringInvoiceId?: number;
  children: ReactNode;
}) {
  const { featureCan } = useFeatureCan();
  const isNewMode = !recurringInvoiceId;

  const { data: recurringInvoice, isLoading: isRecurringInvoiceLoading } =
    useRecurringInvoice(recurringInvoiceId);

  const { data: customers, isLoading: isCustomersLoading } = useCustomers({
    page_size: 10000,
  });
  const { data: items, isLoading: isItemsLoading } = useItems({
    page_size: 10000,
  });
  const { data: taxRates, isLoading: isTaxRatesLoading } = useTaxRates({
    enabled: featureCan(Features.SalesTax),
  });
  const { data: state, isLoading: isStateLoading } = useRecurringInvoiceState();

  const { mutateAsync: createRecurringInvoice, isPending: isCreating } =
    useCreateRecurringInvoice();
  const { mutateAsync: editRecurringInvoice, isPending: isEditing } =
    useEditRecurringInvoice();

  const isLoading =
    (!isNewMode && isRecurringInvoiceLoading) ||
    isCustomersLoading ||
    isItemsLoading ||
    (featureCan(Features.SalesTax) && isTaxRatesLoading) ||
    isStateLoading;

  const value: RecurringInvoiceFormContextValue = {
    recurringInvoice,
    customers: customers?.data ?? [],
    items: items?.data ?? [],
    taxRates: taxRates ?? [],
    state,
    isNewMode,
    isLoading: isLoading || isCreating || isEditing,
    createRecurringInvoice,
    editRecurringInvoice,
  };

  return (
    <DashboardInsider loading={isLoading} name={'recurring-invoice-form'}>
      <RecurringInvoiceFormContext.Provider value={value}>
        {children}
      </RecurringInvoiceFormContext.Provider>
    </DashboardInsider>
  );
}

export function useRecurringInvoiceFormContext() {
  const ctx = useContext(RecurringInvoiceFormContext);
  if (!ctx) {
    throw new Error(
      'useRecurringInvoiceFormContext must be used within RecurringInvoiceFormProvider',
    );
  }
  return ctx;
}
