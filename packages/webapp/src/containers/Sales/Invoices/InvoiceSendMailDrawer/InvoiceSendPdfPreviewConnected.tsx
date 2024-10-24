import { Box } from "@/components";
import { InvoicePaperTemplate } from "../InvoiceCustomize/InvoicePaperTemplate";
import { css } from "@emotion/css";
import { useInvoiceSendMailBoot } from "./InvoiceSendMailContentBoot";

export function InvoiceSendPdfPreviewConnected() {
  const { invoice } = useInvoiceSendMailBoot();

  return (
    <Box px={4} py={6}>
      <InvoicePaperTemplate
        dueDate={invoice.due_date_formatted}
        dateIssue={invoice.invoice_date_formatted}
        invoiceNumber={invoice.invoice_no}
        total={invoice.total_formatted}
        subtotal={invoice.subtotal}
        discount={''}
        paymentMade={''}
        balanceDue={invoice.due_amount_Formatted}
        statement={invoice.statement}
        className={css`
          margin: 0 auto;
        `}
      />
    </Box>
  );
}
