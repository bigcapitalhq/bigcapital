import { Text, Classes, Button, Intent } from '@blueprintjs/core';
import clsx from 'classnames';
import { Box, Group, Stack } from '@/components';
import styles from './PaymentPortal.module.scss';
import { usePaymentPortalBoot } from './PaymentPortalBoot';

export function PaymentPortal() {
  const { sharableLinkMeta } = usePaymentPortalBoot();

  return (
    <Box className={styles.root}>
      <Stack className={styles.body}>
        <Group spacing={8}>
          <Box className={styles.companyLogoWrap}></Box>
          <Text>{sharableLinkMeta?.companyName}</Text>
        </Group>

        <Stack spacing={6}>
          <h1 className={styles.bigTitle}>
            {sharableLinkMeta?.companyName} Sent an Invoice for{' '}
            {sharableLinkMeta?.totalFormatted}
          </h1>
          <Text className={clsx(Classes.TEXT_MUTED, styles.invoiceDueDate)}>
            Invoice due {sharableLinkMeta?.dueDateFormatted}
          </Text>
        </Stack>

        <Stack spacing={2}>
          <Box className={styles.customerName}>{sharableLinkMeta?.customerName}</Box>
          <Box>Bigcapital Technology, Inc.</Box>
          <Box>131 Continental Dr Suite 305 Newark,</Box>
          <Box>Delaware 19713</Box>
          <Box>United States</Box>
          <Box>ahmed@bigcapital.app</Box>
        </Stack>

        <h2 className={styles.invoiceNumber}>
          Invoice {sharableLinkMeta?.invoiceNo}
        </h2>

        <Stack spacing={0} className={styles.totals}>
          <Group
            position={'apart'}
            className={clsx(styles.totalItem, styles.borderBottomGray)}
          >
            <Text>Sub Total</Text>
            <Text>{sharableLinkMeta?.subtotalFormatted}</Text>
          </Group>

          <Group position={'apart'} className={styles.totalItem}>
            <Text>Total</Text>
            <Text style={{ fontWeight: 600 }}>
              {sharableLinkMeta?.totalFormatted}
            </Text>
          </Group>

          <Group
            position={'apart'}
            className={clsx(styles.totalItem, styles.borderBottomDark)}
          >
            <Text>Paid Amount (-)</Text>
            <Text>{sharableLinkMeta?.paymentAmountFormatted}</Text>
          </Group>

          <Group
            position={'apart'}
            className={clsx(styles.totalItem, styles.borderBottomDark)}
          >
            <Text>Due Amount</Text>
            <Text style={{ fontWeight: 600 }}>
              {sharableLinkMeta?.dueAmountFormatted}
            </Text>
          </Group>
        </Stack>

        <Stack spacing={8}>
          <Button
            minimal
            className={clsx(styles.footerButton, styles.downloadInvoiceButton)}
          >
            Download Invoice
          </Button>
          <Button
            className={clsx(styles.footerButton, styles.viewInvoiceButton)}
          >
            View Invoice
          </Button>
          <Button
            intent={Intent.PRIMARY}
            className={clsx(styles.footerButton, styles.buyButton)}
          >
            Pay {sharableLinkMeta?.totalFormatted}
          </Button>
        </Stack>

        <Text className={clsx(Classes.TEXT_MUTED, styles.buyNote)}>
          By confirming your payment, you allow Bigcapital Technology, Inc. to
          charge you for this payment and save your payment information in
          accordance with their terms.
        </Text>
      </Stack>

      <Stack className={styles.footer}>
        <Stack spacing={0}>
          <Box>
            <strong>Bigcapital Technology, Inc.</strong>
          </Box>
          <Box>131 Continental Dr Suite 305 Newark,</Box>
          <Box>Delaware 19713</Box>
          <Box>United States</Box>
          <Box>ahmed@bigcapital.app</Box>
        </Stack>

        <Stack spacing={0} className={styles.footerText}>
          © 2024 Bigcapital Technology, Inc.
          <br />
          All rights reserved.
        </Stack>
      </Stack>
    </Box>
  );
}
