import { Text, Classes } from '@blueprintjs/core';
import clsx from 'classnames';
import { Box, Group, Stack } from '@/components';
import { usePaymentPortalBoot } from './PaymentPortalBoot';
import styles from './PaymentPortal.module.scss';

export function PaymentPortalInvoiceHeader() {
  const { sharableLinkMeta } = usePaymentPortalBoot();
  return (
    <>
      <Group spacing={10}>
        {sharableLinkMeta?.brandingTemplate?.companyLogoUri && (
          <Box
            className={styles.companyLogoWrap}
            style={{
              backgroundImage: `url(${sharableLinkMeta?.brandingTemplate?.companyLogoUri})`,
            }}
          ></Box>
        )}
        <Text>{sharableLinkMeta?.organization?.name}</Text>
      </Group>

      <Stack spacing={6}>
        <h1 className={styles.bigTitle}>
          {sharableLinkMeta?.organization?.name} Sent an Invoice for{' '}
          {sharableLinkMeta?.totalFormatted}
        </h1>
        <Group spacing={10}>
          <Text className={clsx(Classes.TEXT_MUTED, styles.invoiceDueDate)}>
            Invoice due {sharableLinkMeta?.dueDateFormatted}{' '}
          </Text>
        </Group>
      </Stack>

      <Stack className={styles.address} spacing={2}>
        <Box className={styles.customerName}>
          {sharableLinkMeta?.customerName}
        </Box>

        {sharableLinkMeta?.formattedCustomerAddress && (
          <Box
            dangerouslySetInnerHTML={{
              __html: sharableLinkMeta?.formattedCustomerAddress,
            }}
          />
        )}
      </Stack>

      <h2 className={styles.invoiceNumber}>
        Invoice {sharableLinkMeta?.invoiceNo}
      </h2>
    </>
  );
}
