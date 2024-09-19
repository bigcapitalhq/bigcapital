// @ts-nocheck
import { Box, DrawerBody, DrawerHeaderContent } from '@/components';
import { InvoicePaperTemplate } from '@/containers/Sales/Invoices/InvoiceCustomize/InvoicePaperTemplate';

export function PaymentInvoicePreviewContent() {
  return (
    <>
      <DrawerHeaderContent title={'Invoice'} />

      <DrawerBody>
        <Box style={{ paddingTop: 20, paddingBottom: 20 }}>
          <InvoicePaperTemplate />
        </Box>
      </DrawerBody>
    </>
  );
}
