import { InvoicePaperTemplate } from '@bigcapital/pdf-templates';
import { usePaymentPortalBoot } from '../../PaymentPortalBoot';
import { Box, DrawerBody, DrawerHeaderContent } from '@/components';

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
            dueAmount={sharableLinkMeta?.dueAmountFormatted}
            paymentMade={sharableLinkMeta?.paymentAmountFormatted}
            termsConditions={sharableLinkMeta?.termsConditions}
            statement={sharableLinkMeta?.invoiceMessage}
            primaryColor={sharableLinkMeta?.brandingTemplate?.primaryColor}
            secondaryColor={sharableLinkMeta?.brandingTemplate?.secondaryColor}
            style={{
              borderRadius: 5,
              boxShadow:
                'inset 0 4px 0 0 var(--invoice-primary-color), 0 10px 15px rgba(0, 0, 0, 0.05)',
            }}
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
