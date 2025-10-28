// @ts-nocheck
import { Box, DrawerBody, DrawerHeaderContent } from '@/components';
import { InvoicePaperTemplate } from '@/containers/Sales/Invoices/InvoiceCustomize/InvoicePaperTemplate';
import { usePaymentPortalBoot } from '../../PaymentPortalBoot';

export function PaymentInvoicePreviewContent() {
  const { sharableLinkMeta } = usePaymentPortalBoot();

  return (
    <>
      <DrawerHeaderContent title={'Invoice'} />

      <DrawerBody>
        <Box style={{ paddingTop: 20, paddingBottom: 20 }}>
          <InvoicePaperTemplate
            invoiceNumber={sharableLinkMeta?.invoiceNo}
            dueDate={sharableLinkMeta?.dueDateFormatted}
            dateIssue={sharableLinkMeta?.invoiceDateFormatted}
            total={sharableLinkMeta?.totalFormatted}
            subtotal={sharableLinkMeta?.subtotalFormatted}
            balanceDue={sharableLinkMeta?.dueAmountFormatted}
            paymentMade={sharableLinkMeta?.paymentAmountFormatted}
            termsConditions={sharableLinkMeta?.termsConditions}
            statement={sharableLinkMeta?.invoiceMessage}
            companyName={sharableLinkMeta?.companyName}
            lines={sharableLinkMeta?.entries?.map((entry) => ({
              item: entry.itemName,
              description: entry.description,
              quantity: entry.quantityFormatted,
              rate: entry.rateFormatted,
              total: entry.totalFormatted,
            }))}
            taxes={sharableLinkMeta?.taxes?.map((tax) => ({
              label: tax.name,
              amount: tax.taxRateAmountFormatted,
            }))}
            companyAddress={
              sharableLinkMeta?.organization?.addressTextFormatted
            }
            customerAddress={sharableLinkMeta?.formattedCustomerAddress}
          />
        </Box>
      </DrawerBody>
    </>
  );
}
