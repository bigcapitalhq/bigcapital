import { Text, Classes, Button, Intent, ButtonProps } from '@blueprintjs/core';
import clsx from 'classnames';
import { Box, Group, Stack } from '@/components';
import styles from './PaymentPortal.module.scss';

export interface PaymentPageProps {
  companyLogoUri: string;
  organizationName: string;
  customerName: string;
  subtotal: string;
  total: string;
  dueDate: string;
  viewInvoiceLabel?: string;
  invoiceNumber: string;
  totalLabel?: string;
  subtotalLabel?: string;
  customerAddress?: string;
  downloadInvoiceBtnLabel?: string;
  showPayButton?: boolean;
  paidAmount: string;
  paidAmountLabel?: string;
  organizationAddress: string;
  dueAmount: string;
  dueAmountLabel?: string;
  downloadInvoiceButtonProps?: Partial<ButtonProps>;
  payInvoiceButtonProps?: Partial<ButtonProps>;
  viewInvoiceButtonProps?: Partial<ButtonProps>;
  invoiceNumberLabel?: string;
  buyNote?: string;
  copyrightText?: string;
}

export function InvoicePaymentPage({
  companyLogoUri,
  organizationName,
  customerName,
  subtotal,
  total,
  dueDate,
  paidAmount,
  paidAmountLabel = 'Paid Amount (-)',
  invoiceNumber,
  customerAddress,
  totalLabel = 'Total',
  subtotalLabel = 'Subtotal',
  viewInvoiceLabel = 'View Invoice',
  downloadInvoiceBtnLabel = 'Download Invoice',
  showPayButton = true,
  organizationAddress,
  dueAmount,
  dueAmountLabel = 'Due Amount',
  downloadInvoiceButtonProps,
  payInvoiceButtonProps,
  viewInvoiceButtonProps,
  invoiceNumberLabel = 'Invoice #',
  buyNote = 'By confirming your payment, you allow Bigcapital Technology, Inc. to charge you for this payment and save your payment information in accordance with their terms.',
  copyrightText = `© 2024 Bigcapital Technology, Inc. <br /> All rights reserved.`,
}: PaymentPageProps) {
  return (
    <Box className={styles.root}>
      <Stack spacing={0} className={styles.body}>
        <Stack>
          <Group spacing={10}>
            {companyLogoUri && (
              <Box
                className={styles.companyLogoWrap}
                style={{
                  backgroundImage: `url(${companyLogoUri})`,
                }}
              ></Box>
            )}
            <Text>{organizationName}</Text>
          </Group>

          <Stack spacing={6}>
            <h1 className={styles.bigTitle}>
              {organizationName} Sent an Invoice for {total}
            </h1>
            <Group spacing={10}>
              <Text className={clsx(Classes.TEXT_MUTED, styles.invoiceDueDate)}>
                Invoice due {dueDate}{' '}
              </Text>
            </Group>
          </Stack>

          <Stack className={styles.address} spacing={2}>
            <Box className={styles.customerName}>{customerName}</Box>

            {customerAddress && (
              <Box dangerouslySetInnerHTML={{ __html: customerAddress }} />
            )}
          </Stack>

          <h2 className={styles.invoiceNumber}>Invoice {invoiceNumber}</h2>

          <Stack spacing={0} className={styles.totals}>
            <Group
              position={'apart'}
              className={clsx(styles.totalItem, styles.borderBottomGray)}
            >
              <Text>{subtotalLabel}</Text>
              <Text>{subtotal}</Text>
            </Group>

            <Group position={'apart'} className={styles.totalItem}>
              <Text>{totalLabel}</Text>
              <Text style={{ fontWeight: 500 }}>{total}</Text>
            </Group>
            {/* 
            {sharableLinkMeta?.taxes?.map((tax, key) => (
              <Group key={key} position={'apart'} className={styles.totalItem}>
                <Text>{tax?.name}</Text>
                <Text>{tax?.taxRateAmountFormatted}</Text>
              </Group>
            ))} */}
            <Group
              position={'apart'}
              className={clsx(styles.totalItem, styles.borderBottomGray)}
            >
              <Text>{paidAmountLabel}</Text>
              <Text>{paidAmount}</Text>
            </Group>

            <Group
              position={'apart'}
              className={clsx(styles.totalItem, styles.borderBottomDark)}
            >
              <Text>Due Amount</Text>
              <Text style={{ fontWeight: 500 }}>{dueAmount}</Text>
            </Group>
          </Stack>
        </Stack>

        <Stack spacing={8} className={styles.footerButtons}>
          <Button
            minimal
            className={clsx(styles.footerButton, styles.downloadInvoiceButton)}
            {...downloadInvoiceButtonProps}
          >
            {downloadInvoiceBtnLabel}
          </Button>

          <Button
            className={clsx(styles.footerButton, styles.viewInvoiceButton)}
            {...viewInvoiceButtonProps}
          >
            {viewInvoiceLabel}
          </Button>

          {showPayButton && (
            <Button
              intent={Intent.PRIMARY}
              className={clsx(styles.footerButton, styles.buyButton)}
              {...payInvoiceButtonProps}
            >
              Pay {total}
            </Button>
          )}
        </Stack>

        {buyNote && (
          <Text className={clsx(Classes.TEXT_MUTED, styles.buyNote)}>
            {buyNote}
          </Text>
        )}
      </Stack>

      <Stack spacing={18} className={styles.footer}>
        <Box dangerouslySetInnerHTML={{ __html: organizationAddress }}></Box>

        {copyrightText && (
          <Stack
            spacing={0}
            className={styles.footerText}
            dangerouslySetInnerHTML={{ __html: copyrightText }}
          ></Stack>
        )}
      </Stack>
    </Box>
  );
}
