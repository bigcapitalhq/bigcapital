import { Button, Card, H4, Intent, ProgressBar, Text } from '@blueprintjs/core';
import { Can, Group, Stack } from '@/components';
import { useGetSubscriptionUsage } from '@/hooks/query/subscription';

interface UsageRowProps {
  label: string;
  used: number;
  limit: number;
}

function UsageRow({ label, used, limit }: UsageRowProps) {
  const value = limit > 0 ? Math.min(used / limit, 1) : 0;
  const intent = used >= limit ? Intent.DANGER : Intent.PRIMARY;

  return (
    <Stack spacing={4}>
      <Group position="apart">
        <Text>{label}</Text>
        <Text className="bp4-text-muted">
          {used} of {limit}
        </Text>
      </Group>
      <ProgressBar value={value} intent={intent} stripes={false} />
    </Stack>
  );
}

/**
 * Free-plan usage summary with an upgrade CTA.
 */
export function FreePlanUsage() {
  const { data: usage } = useGetSubscriptionUsage();

  if (!usage || usage.plan !== 'free') {
    return null;
  }

  const invoiceLimit = usage.invoices.limit ?? 0;
  const billLimit = usage.bills.limit ?? 0;

  const handleUpgrade = () => {
    document
      .getElementById('billing-plans')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Card style={{ marginTop: '2rem' }}>
      <Group position="apart" align="center">
        <H4 style={{ margin: 0 }}>Free plan</H4>
        <Can I="manage" a="all">
          <Button intent={Intent.PRIMARY} onClick={handleUpgrade}>
            Upgrade to Go
          </Button>
        </Can>
      </Group>

      <Text className="bp4-text-muted" style={{ marginTop: '0.5rem' }}>
        The free plan includes up to {invoiceLimit} invoices and {billLimit}{' '}
        bills. Upgrade to Go for unlimited documents and all features.
      </Text>

      <Stack spacing={12} style={{ marginTop: '1.5rem' }}>
        <UsageRow
          label="Invoices"
          used={usage.invoices.used}
          limit={invoiceLimit}
        />
        <UsageRow label="Bills" used={usage.bills.used} limit={billLimit} />
      </Stack>
    </Card>
  );
}
