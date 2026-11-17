import React from 'react';
import intl from 'react-intl-universal';
import type { RecurringInvoice } from '@bigcapital/sdk-ts';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { DRAWERS } from '@/constants/drawers';
import { useRecurringInvoice } from '@/hooks/query';

export interface RecurringInvoiceDetailDrawerContextValue {
  recurringInvoiceId: number | undefined;
  recurringInvoice: RecurringInvoice | undefined;
}

interface RecurringInvoiceDetailDrawerProviderProps {
  recurringInvoiceId: number | undefined;
  children?: React.ReactNode;
}

const RecurringInvoiceDetailDrawerContext = React.createContext<
  RecurringInvoiceDetailDrawerContextValue | undefined
>(undefined);

/**
 * Recurring invoice detail drawer provider.
 */
function RecurringInvoiceDetailDrawerProvider({
  recurringInvoiceId,
  ...props
}: RecurringInvoiceDetailDrawerProviderProps) {
  // Fetch recurring invoice details.
  const { isLoading, data: recurringInvoice } = useRecurringInvoice(
    recurringInvoiceId,
    { enabled: !!recurringInvoiceId },
  );

  const provider: RecurringInvoiceDetailDrawerContextValue = {
    recurringInvoiceId,
    recurringInvoice,
  };

  return (
    <DrawerLoading loading={isLoading}>
      <DrawerHeaderContent
        name={DRAWERS.RECURRING_INVOICE_DETAILS}
        title={
          recurringInvoice?.profileName
            ? intl.get('recurring_invoice_details.drawer.title', {
                profileName: recurringInvoice.profileName,
              })
            : intl.get('recurring_invoice_details')
        }
        subTitle={
          recurringInvoice?.customer?.displayName
            ? intl.get('recurring_invoice_details.drawer.subtitle', {
                customerName: recurringInvoice?.customer?.displayName,
              })
            : null
        }
      />
      <RecurringInvoiceDetailDrawerContext.Provider
        value={provider}
        {...props}
      />
    </DrawerLoading>
  );
}

const useRecurringInvoiceDetailDrawerContext =
  (): RecurringInvoiceDetailDrawerContextValue => {
    const ctx = React.useContext(RecurringInvoiceDetailDrawerContext);
    if (ctx === undefined) {
      throw new Error(
        'useRecurringInvoiceDetailDrawerContext must be used within a RecurringInvoiceDetailDrawerProvider',
      );
    }
    return ctx;
  };

export {
  RecurringInvoiceDetailDrawerProvider,
  useRecurringInvoiceDetailDrawerContext,
};
