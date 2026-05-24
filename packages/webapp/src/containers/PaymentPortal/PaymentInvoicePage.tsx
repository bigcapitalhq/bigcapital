import { Text, Classes, Button, Intent } from '@blueprintjs/core';
import clsx from 'classnames';
import { css } from '@emotion/css';
import { AppToaster, Box, Group, Stack } from '@/components';
import { PaymentPortalBoot, usePaymentPortalBoot } from './PaymentPortalBoot';
import { useDrawerActions } from '@/hooks/state';
import { useCreateStripeCheckoutSession } from '@/hooks/query/payment-link';
import { DRAWERS } from '@/constants/drawers';
import styles from './PaymentPortal.module.scss';
import { DownloadInvoiceButton } from './DownloadInvoiceButton';
import { PaymentPortalInvoiceHeader } from './PaymentPortalInvoiceHeader';
import PaymentPortalPage from './PaymentPortalPage';
import { PaymentInvoicePreviewDrawer } from './drawers/PaymentInvoicePreviewDrawer/PaymentInvoicePreviewDrawer';
import { useParams } from 'react-router-dom';

function PaymentInvoicePage() {
  const { openDrawer } = useDrawerActions();
  const { sharableLinkMeta, linkId } = usePaymentPortalBoot();
  const {
    mutateAsync: createStripeCheckoutSession,
    isLoading: isStripeCheckoutLoading,
  } = useCreateStripeCheckoutSession();

  // Handles invoice preview button click.
  const handleInvoicePreviewBtnClick = () => {
    openDrawer(DRAWERS.PAYMENT_INVOICE_PREVIEW);
  };

  // handles the pay button click.
  const handlePayButtonClick = () => {
    createStripeCheckoutSession({ linkId })
      .then((session) => {
        window.open(session.redirectTo);
      })
      .catch((error) => {
        AppToaster.show({
          intent: Intent.DANGER,
          message: 'Something went wrong.',
        });
      });
  };

  return (
    <PaymentPortalPage>
      <Stack spacing={0} className={styles.body}>
        <Stack>
          <PaymentPortalInvoiceHeader />
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
              <Text style={{ fontWeight: 500 }}>
                {sharableLinkMeta?.totalFormatted}
              </Text>
            </Group>

            {sharableLinkMeta?.taxes?.map((tax, key) => (
              <Group key={key} position={'apart'} className={styles.totalItem}>
                <Text>{tax?.name}</Text>
                <Text>{tax?.taxRateAmountFormatted}</Text>
              </Group>
            ))}
            <Group
              position={'apart'}
              className={clsx(styles.totalItem, styles.borderBottomGray)}
            >
              <Text>Paid Amount (-)</Text>
              <Text>{sharableLinkMeta?.paymentAmountFormatted}</Text>
            </Group>

            <Group
              position={'apart'}
              className={clsx(styles.totalItem, styles.borderBottomDark)}
            >
              <Text>Due Amount</Text>
              <Text style={{ fontWeight: 500 }}>
                {sharableLinkMeta?.dueAmountFormatted}
              </Text>
            </Group>
          </Stack>
        </Stack>

        <Stack spacing={8} className={styles.footerButtons}>
          <DownloadInvoiceButton />

          <Button
            onClick={handleInvoicePreviewBtnClick}
            className={clsx(styles.footerButton, styles.viewInvoiceButton)}
          >
            View Invoice
          </Button>

          {sharableLinkMeta?.isReceivable &&
            sharableLinkMeta?.hasStripePaymentMethod && (
              <Button
                intent={Intent.PRIMARY}
                className={clsx(
                  styles.footerButton,
                  styles.buyButton,
                  css`
                    &.bp4-button.bp4-intent-primary {
                      background-color: var(--payment-page-primary-button);

                      &:hover,
                      &:focus {
                        background-color: var(
                          --payment-page-primary-button-hover
                        );
                      }
                    }
                  `,
                )}
                loading={isStripeCheckoutLoading}
                onClick={handlePayButtonClick}
              >
                Pay {sharableLinkMeta?.totalFormatted}
              </Button>
            )}
        </Stack>

        <Text className={clsx(Classes.TEXT_MUTED, styles.buyNote)}>
          By confirming your payment, you allow Bigcapital Technology, Inc. to
          charge you for this payment and save your payment information in
          accordance with their terms.
        </Text>
      </Stack>

      <Stack spacing={18} className={styles.footer}>
        <Box
          dangerouslySetInnerHTML={{
            __html: sharableLinkMeta?.organization?.addressTextFormatted || '',
          }}
        ></Box>

        <Stack spacing={0} className={styles.footerText}>
          © 2024 Bigcapital Technology, Inc.
          <br />
          All rights reserved.
        </Stack>
      </Stack>
      <PaymentInvoicePreviewDrawer name={DRAWERS.PAYMENT_INVOICE_PREVIEW} />
    </PaymentPortalPage>
  );
}

export default function PaymentInvoicePageWrapper() {
  const { linkId } = useParams<{ linkId: string }>();

  return (
    <PaymentPortalBoot linkId={linkId}>
      <PaymentInvoicePage />
    </PaymentPortalBoot>
  );
}
