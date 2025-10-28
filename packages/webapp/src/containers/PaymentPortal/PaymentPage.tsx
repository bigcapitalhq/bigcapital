import { Text, Classes, Button, Intent, ButtonProps } from '@blueprintjs/core';
import clsx from 'classnames';
import { css } from '@emotion/css';
import { lighten } from 'polished';
import { Box, Group, Stack } from '@/components';
import styles from './PaymentPortal.module.scss';

export interface PaymentPageProps {
  // # Company name
  companyLogoUri: string;
  organizationName: string;
  organizationAddress: string;

  // # Colors
  primaryColor?: string;

  // # Customer name
  customerName: string;
  customerAddress?: string;

  // # Subtotal
  subtotal: string;
  subtotalLabel?: string;

  // # Total
  total: string;
  totalLabel?: string;

  // # Due date
  dueDate: string;

  // # Paid amount
  paidAmount: string;
  paidAmountLabel?: string;

  // # Due amount
  dueAmount: string;
  dueAmountLabel?: string;

  // # Download invoice button
  downloadInvoiceBtnLabel?: string;
  downloadInvoiceButtonProps?: Partial<ButtonProps>;

  // # View invoice button
  viewInvoiceLabel?: string;
  viewInvoiceButtonProps?: Partial<ButtonProps>;

  // # Invoice number
  invoiceNumber: string;
  invoiceNumberLabel?: string;

  // # Pay button
  showPayButton?: boolean;
  payButtonLabel?: string;
  payInvoiceButtonProps?: Partial<ButtonProps>;

  // # Buy note
  buyNote?: string;

  // # Copyright
  copyrightText?: string;

  classNames?: Record<string, string>
}

export function InvoicePaymentPage({
  // # Company
  companyLogoUri,
  organizationName,
  organizationAddress,

  // # Colors
  primaryColor = 'rgb(0, 82, 204)',

  // # Customer
  customerName,
  customerAddress,

  // # Subtotal
  subtotal,
  subtotalLabel = 'Subtotal',

  // # Total
  total,
  totalLabel = 'Total',

  // # Due date
  dueDate,

  // # Paid amount
  paidAmount,
  paidAmountLabel = 'Paid Amount (-)',

  // # Invoice number
  invoiceNumber,
  invoiceNumberLabel = 'Invoice #',

  // # Download invoice button
  downloadInvoiceBtnLabel = 'Download Invoice',
  downloadInvoiceButtonProps,

  // # View invoice button
  viewInvoiceLabel = 'View Invoice',
  viewInvoiceButtonProps,

  // # Due amount
  dueAmount,
  dueAmountLabel = 'Due Amount',

  // # Pay button
  showPayButton = true,
  payButtonLabel = 'Pay {total}',
  payInvoiceButtonProps,

  // # Buy note
  buyNote = 'By confirming your payment, you allow Bigcapital Technology, Inc. to charge you for this payment and save your payment information in accordance with their terms.',

  // # Copyright
  copyrightText = `© 2024 Bigcapital Technology, Inc. <br /> All rights reserved.`,
  classNames,
}: PaymentPageProps) {
  return (
    <Box className={clsx(styles.root, classNames?.root)}>
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
            <h1 className={clsx(styles.bigTitle, classNames?.bigTitle)}>
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

          <h2 className={styles.invoiceNumber}>
            {invoiceNumberLabel} {invoiceNumber}
          </h2>

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
              <Text>{dueAmountLabel}</Text>
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
              className={clsx(
                styles.footerButton,
                styles.buyButton,
                css`
                  &.bp4-intent-primary {
                    background-color: ${primaryColor};

                    &:hover,
                    &:focus {
                      background-color: ${lighten(0.1, primaryColor)};
                    }
                  }
                `,
              )}
              {...payInvoiceButtonProps}
            >
              {payButtonLabel.replace('{total}', total)}
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
