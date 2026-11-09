import { Button, Card, H4, Intent, Tag, Text } from '@blueprintjs/core';
import { useBillingPageBoot } from './BillingPageBoot';
import { AppToaster, Can, Group, Stack } from '@/components';
import { useCreateStripePortalSession } from '@/hooks/query/subscription';

/**
 * Payment method summary with a link to the Stripe Customer Portal.
 */
export function BillingPaymentMethod() {
  const { billingOverview } = useBillingPageBoot();
  const { mutateAsync: createPortalSession, isPending } =
    useCreateStripePortalSession();

  if (!billingOverview?.customer) {
    return null;
  }

  const handleManageBilling = () => {
    createPortalSession()
      .then(({ url }) => {
        window.location.assign(url);
      })
      .catch(() => {
        AppToaster.show({
          message: 'Unable to open the billing portal. Please try again.',
          intent: Intent.DANGER,
        });
      });
  };

  const paymentMethod = billingOverview.paymentMethod;

  return (
    <Card style={{ marginTop: '2rem' }}>
      <Group position="apart" align="center">
        <H4 style={{ margin: 0 }}>Payment method</H4>
        <Can I="manage" a="all">
          <Button
            minimal
            intent={Intent.PRIMARY}
            onClick={handleManageBilling}
            loading={isPending}
          >
            Manage billing
          </Button>
        </Can>
      </Group>

      <Stack spacing={4} style={{ marginTop: '1rem' }}>
        {paymentMethod ? (
          <Group spacing={8} align="center">
            <Tag minimal>{paymentMethod.brand.toUpperCase()}</Tag>
            <Text>•••• {paymentMethod.last4}</Text>
            <Text className="bp4-text-muted">
              Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
            </Text>
          </Group>
        ) : (
          <Text className="bp4-text-muted">No payment method on file yet.</Text>
        )}

        {billingOverview.customer.email && (
          <Text className="bp4-text-muted">
            Billing email: {billingOverview.customer.email}
          </Text>
        )}

        {billingOverview.upcomingInvoice?.dateFormatted && (
          <Text className="bp4-text-muted">
            Next invoice: {billingOverview.upcomingInvoice.amountDueFormatted}{' '}
            on {billingOverview.upcomingInvoice.dateFormatted}
          </Text>
        )}
      </Stack>
    </Card>
  );
}
