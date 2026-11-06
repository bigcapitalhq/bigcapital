import type { ExtensionSlotName } from '@bigcapital/extension-sdk/web';
import type { Customer, SaleInvoice } from '@bigcapital/sdk-ts';
import type { FormikProps } from 'formik';

/**
 * Context passed by the host to extension components rendered in a slot.
 *
 * Keep each context minimal and stable. Extension components should not rely on
 * internal host objects that are not listed here.
 */
export interface ExtensionSlotContexts {
  'dashboard.widgets': {
    organizationId?: string | null;
  };
  'invoice.detail.actions': {
    invoice: SaleInvoice;
    invoiceId?: number;
  };
  'invoice.detail.sidebar': {
    invoice: SaleInvoice;
    invoiceId?: number;
  };
  'contact.form.fields': {
    contact?: Customer;
    form: FormikProps<any>;
  };
  'settings.tabs': {
    organizationId?: string | null;
  };
  'app.header.actions': Record<string, never>;
  'commandPalette.commands': Record<string, never>;
}

export type { ExtensionSlotName };
