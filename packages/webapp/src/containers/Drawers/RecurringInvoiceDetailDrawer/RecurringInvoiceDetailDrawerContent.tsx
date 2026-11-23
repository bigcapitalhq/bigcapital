import React from 'react';
import { RecurringInvoiceDetail } from './RecurringInvoiceDetail';
import { RecurringInvoiceDetailDrawerProvider } from './RecurringInvoiceDetailDrawerProvider';
import type { RecurringInvoiceDetailTabId } from './types';
import { DrawerBody } from '@/components';

interface RecurringInvoiceDetailDrawerContentProps {
  recurringInvoiceId: number | undefined;
  defaultTab?: RecurringInvoiceDetailTabId;
  isOpen?: boolean;
}

/**
 * Recurring invoice detail drawer content.
 */
export function RecurringInvoiceDetailDrawerContent({
  recurringInvoiceId,
  defaultTab,
  isOpen,
}: RecurringInvoiceDetailDrawerContentProps) {
  return (
    <RecurringInvoiceDetailDrawerProvider
      recurringInvoiceId={recurringInvoiceId}
    >
      <DrawerBody>
        <RecurringInvoiceDetail defaultTab={defaultTab} isOpen={isOpen} />
      </DrawerBody>
    </RecurringInvoiceDetailDrawerProvider>
  );
}
