// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { DrawerHeaderContent, DrawerLoading } from '@/components';
import { Features } from '@/constants';
import { useInvoice } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';
import { DRAWERS } from '@/constants/drawers';

const InvoiceDetailDrawerContext = React.createContext();
/**
 * Invoice detail provider.
 */
function InvoiceDetailDrawerProvider({ invoiceId, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();

  // Fetch sale invoice details.
  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(invoiceId, {
    enabled: !!invoiceId,
  });

  // Provider.
  const provider = {
    invoiceId,
    invoice,
  };

  return (
    <DrawerLoading loading={isInvoiceLoading}>
      <DrawerHeaderContent
        name={DRAWERS.INVOICE_DETAILS}
        title={intl.get('invoice_details.drawer.title', {
          invoiceNumber: invoice.invoice_no,
        })}
        subTitle={
          featureCan(Features.Branches)
            ? intl.get('invoice_details.drawer.subtitle', {
                value: invoice.branch?.name,
              })
            : null
        }
      />
      <InvoiceDetailDrawerContext.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useInvoiceDetailDrawerContext = () =>
  React.useContext(InvoiceDetailDrawerContext);

export { InvoiceDetailDrawerProvider, useInvoiceDetailDrawerContext };
