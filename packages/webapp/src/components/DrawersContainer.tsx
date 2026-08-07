import { DRAWERS } from '@/constants/drawers';
import { BrandingTemplatesDrawer } from '@/containers/BrandingTemplates/BrandingTemplatesDrawer';
import { index as CustomerDetailsDrawer } from '@/containers/Drawers/CustomerDetailsDrawer';
import { index as QuickCreateCustomerDrawer } from '@/containers/Drawers/QuickCreateCustomerDrawer';
import { index as QuickCreateItemDrawer } from '@/containers/Drawers/QuickCreateItemDrawer';
import { index as QuickWriteVendorDrawer } from '@/containers/Drawers/QuickWriteVendorDrawer';
import { index as VendorDetailsDrawer } from '@/containers/Drawers/VendorDetailsDrawer';
import { CreditNoteCustomizeDrawer } from '@/containers/Sales/CreditNotes/CreditNoteCustomize/CreditNoteCustomizeDrawer';
import { EstimateCustomizeDrawer } from '@/containers/Sales/Estimates/EstimateCustomize/EstimateCustomizeDrawer';
import { InvoiceCustomizeDrawer } from '@/containers/Sales/Invoices/InvoiceCustomize/InvoiceCustomizeDrawer';
import { PaymentReceivedCustomizeDrawer } from '@/containers/Sales/PaymentsReceived/PaymentReceivedCustomize/PaymentReceivedCustomizeDrawer';
import { ReceiptCustomizeDrawer } from '@/containers/Sales/Receipts/ReceiptCustomize/ReceiptCustomizeDrawer';
import { CreateWorkspaceDrawer } from '@/ee/workspaces/containers/CreateWorkspaceDrawer/CreateWorkspaceDrawer';
import { OrganizationsListDrawer } from '@/ee/workspaces/containers/OrganizationsListDrawer';

/**
 * Global drawers container.
 *
 * Hosts drawers that are cross-cutting: opened from shared form components
 * (quick-create selectors, customer/vendor links), sales document actions
 * bars (branding/customize), or app-level UI (workspace switcher). Each
 * feature page mounts its own page-scoped drawers in a co-located
 * `<Page>Drawers` component.
 */
export default function DrawersContainer() {
  return (
    <div>
      <CustomerDetailsDrawer name={DRAWERS.CUSTOMER_DETAILS} />
      <VendorDetailsDrawer name={DRAWERS.VENDOR_DETAILS} />
      <QuickCreateCustomerDrawer name={DRAWERS.QUICK_CREATE_CUSTOMER} />
      <QuickCreateItemDrawer name={DRAWERS.QUICK_CREATE_ITEM} />
      <QuickWriteVendorDrawer name={DRAWERS.QUICK_WRITE_VENDOR} />
      <InvoiceCustomizeDrawer name={DRAWERS.INVOICE_CUSTOMIZE} />
      <EstimateCustomizeDrawer name={DRAWERS.ESTIMATE_CUSTOMIZE} />
      <ReceiptCustomizeDrawer name={DRAWERS.RECEIPT_CUSTOMIZE} />
      <CreditNoteCustomizeDrawer name={DRAWERS.CREDIT_NOTE_CUSTOMIZE} />
      <PaymentReceivedCustomizeDrawer
        name={DRAWERS.PAYMENT_RECEIVED_CUSTOMIZE}
      />
      <BrandingTemplatesDrawer name={DRAWERS.BRANDING_TEMPLATES} />
      <CreateWorkspaceDrawer name={DRAWERS.CREATE_WORKSPACE} />
      <OrganizationsListDrawer name={DRAWERS.ORGANIZATIONS_LIST} />
    </div>
  );
}
