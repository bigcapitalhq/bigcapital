import { Text, Classes, Button, Intent } from '@blueprintjs/core';
import clsx from 'classnames';
import { Box, Group, Stack } from '@/components';
import styles from './PaymentPortal.module.scss';

export function PaymentPortal() {
  return (
    <Box className={styles.root}>
      <Stack className={styles.body}>
        <Group spacing={8}>
          <Box className={styles.companyLogoWrap}></Box>
          <Text>Bigcapital Technology, Inc.</Text>
        </Group>

        <Stack spacing={6}>
          <h1 className={styles.bigTitle}>
            Bigcapital Technology, Inc. Sent an Invoice for $1000.00
          </h1>
          <Text className={clsx(Classes.TEXT_MUTED, styles.invoiceDueDate)}>
            Invoice due September 13, 2024
          </Text>
        </Stack>

        <Stack spacing={2}>
          <Box className={styles.customerName}>Ahmed Bouhuolia</Box>
          <Box>Bigcapital Technology, Inc.</Box>
          <Box>131 Continental Dr Suite 305 Newark,</Box>
          <Box>Delaware 19713</Box>
          <Box>United States</Box>
          <Box>ahmed@bigcapital.app</Box>
        </Stack>

        <h2 className={styles.invoiceNumber}>Invoice INV-000001</h2>

        <Stack spacing={0} className={styles.totals}>
          <Group
            position={'apart'}
            className={clsx(styles.totalItem, styles.borderBottomGray)}
          >
            <Text>Sub Total</Text>
            <Text>11.00</Text>
          </Group>

          <Group position={'apart'} className={styles.totalItem}>
            <Text>Total</Text>
            <Text style={{ fontWeight: 600 }}>11.00</Text>
          </Group>

          <Group
            position={'apart'}
            className={clsx(styles.totalItem, styles.borderBottomDark)}
          >
            <Text>Paid Amount (-)</Text>
            <Text>11.00</Text>
          </Group>

          <Group
            position={'apart'}
            className={clsx(styles.totalItem, styles.borderBottomDark)}
          >
            <Text>Due Amount</Text>
            <Text style={{ fontWeight: 600 }}>11.00</Text>
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
            Pay $10,000.00
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
