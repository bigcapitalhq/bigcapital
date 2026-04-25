// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, Form, useFormikContext } from 'formik';
import {
  Button,
  Callout,
  Classes,
  Collapse,
  FormGroup,
  InputGroup,
  Intent,
  Spinner,
  Text,
} from '@blueprintjs/core';
import { AppToaster, Box, Card, Group, Stack } from '@/components';
import { AccountsSelect } from '@/components/Accounts/AccountsSelect';
import { CustomersSelect } from '@/components/Customers/CustomersSelect';
import { useAccounts } from '@/hooks/query/accounts';
import { useCustomers } from '@/hooks/query/customers';
import { useChangePreferencesPageTitle } from '@/hooks/state';
import {
  SquareConnection,
  useSquareConnection,
  useSquareLocations,
  useUpdateSquareSettings,
} from '@/hooks/query/square-integration';

type WizardValues = {
  clearingAccountId: number | null;
  feesExpenseAccountId: number | null;
  tipsLiabilityAccountId: number | null;
  walkInCustomerId: number | null;
  depositBankAccountId: number | null;
  webhookSignatureKey: string;
};

/**
 * Post-OAuth wizard: user picks the Clearing / Fees / Tips accounts, the
 * walk-in customer, and the bank account that receives Square payouts.
 * Once all five selections are made the server auto-promotes the
 * connection from `pending` to `active`.
 *
 * Tips are booked as a LIABILITY (Tips Payable) — cleared when the owner
 * pays out tips as wages — not recognized as revenue.
 *
 * Uses Formik so the shared AccountsSelect / CustomersSelect components
 * (which read from useFormikContext) have a context to bind to.
 */
export default function SquareConnectionSetupPage() {
  const { id } = useParams<{ id: string }>();
  const connectionId = Number(id);
  const history = useHistory();
  const changePageTitle = useChangePreferencesPageTitle();
  useEffect(() => {
    changePageTitle('Square Setup');
  }, [changePageTitle]);

  const { data: connection, isLoading: loadingConn, refetch } =
    useSquareConnection(connectionId);
  const { mutateAsync: updateSettings } = useUpdateSquareSettings(connectionId);

  const initialValues = useMemo<WizardValues>(
    () => ({
      clearingAccountId: connection?.clearingAccountId ?? null,
      feesExpenseAccountId: connection?.feesExpenseAccountId ?? null,
      tipsLiabilityAccountId: connection?.tipsLiabilityAccountId ?? null,
      walkInCustomerId: connection?.walkInCustomerId ?? null,
      depositBankAccountId: connection?.depositBankAccountId ?? null,
      // Empty until the admin types one — never echoes the existing key
      // back to the browser. A blank submission means "leave the stored
      // key unchanged"; the server only patches when the field is non-empty.
      webhookSignatureKey: '',
    }),
    [connection],
  );

  const handleSubmit = async (values: WizardValues) => {
    try {
      const payload: any = { ...values };
      // Don't transmit an empty override — that would be interpreted as
      // a request to clear the stored key.
      if (!payload.webhookSignatureKey) delete payload.webhookSignatureKey;
      const updated = await updateSettings(payload);
      AppToaster.show({
        message:
          updated.status === 'active'
            ? 'Square connection activated.'
            : 'Settings saved.',
        intent: Intent.SUCCESS,
      });
      refetch();
      if (updated.status === 'active') {
        history.push('/preferences/integrations/square');
      }
    } catch (err: any) {
      AppToaster.show({
        message: err?.message ?? 'Failed to save settings.',
        intent: Intent.DANGER,
      });
    }
  };

  if (loadingConn) return <Spinner />;
  if (!connection) return <Text>Connection not found.</Text>;

  return (
    <PageRoot>
      <Text className={Classes.TEXT_MUTED} style={{ marginBottom: 18 }}>
        Merchant <strong>{connection.merchantId}</strong> ·{' '}
        <strong>{connection.environment}</strong> environment.{' '}
        Configure the accounts Square activity will post into. You can change
        these later.
      </Text>

      {connection.status === 'pending' && (
        <Callout
          intent={Intent.WARNING}
          icon="warning-sign"
          style={{ marginBottom: 16 }}
        >
          This connection is not yet active. Fill in all five selections below
          and click Save to activate.
        </Callout>
      )}

      {!connection.squareWebhookSubscriptionId && connection.statusMessage && (
        <Callout
          intent={Intent.DANGER}
          icon="error"
          title="Webhook auto-registration failed"
          style={{ marginBottom: 16 }}
        >
          {connection.statusMessage}
        </Callout>
      )}

      <Formik<WizardValues>
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        <Form>
          <WizardBody connection={connection} connectionId={connectionId} />
        </Form>
      </Formik>
    </PageRoot>
  );
}

function WizardBody({
  connection,
  connectionId,
}: {
  connection: SquareConnection;
  connectionId: number;
}) {
  const history = useHistory();
  const { values, setFieldValue, isSubmitting } =
    useFormikContext<WizardValues>();
  const { data: accounts = [] } = useAccounts();
  const { data: customersResp } = useCustomers();
  const customers = customersResp?.customers ?? [];
  const { data: locations } = useSquareLocations(connectionId);
  // Open by default if auto-registration failed — the admin needs to act.
  const [advancedOpen, setAdvancedOpen] = useState(
    !connection.squareWebhookSubscriptionId,
  );

  const allAccountsPicked = useMemo(
    () =>
      !!values.clearingAccountId &&
      !!values.feesExpenseAccountId &&
      !!values.tipsLiabilityAccountId &&
      !!values.walkInCustomerId &&
      !!values.depositBankAccountId,
    [values],
  );

  return (
    <>
      <Stack spacing={12}>
        <Card style={{ margin: 0 }}>
          <SectionTitle>Accounts</SectionTitle>
          <FormGroup
            label="Square Clearing Account"
            helperText="Other Current Asset. Holds gross Square sales between sale time and payout arrival."
          >
            <AccountsSelect
              name="clearingAccountId"
              items={accounts}
              filterByRootTypes={['asset']}
              fill
            />
          </FormGroup>
          <FormGroup
            label="Merchant Processing Fees"
            helperText="Expense account. Square's per-transaction fee auto-posts here."
          >
            <AccountsSelect
              name="feesExpenseAccountId"
              items={accounts}
              filterByRootTypes={['expense']}
              fill
            />
          </FormGroup>
          <FormGroup
            label="Tips Payable"
            helperText="Liability account. Tip portion of each sale credits here instead of revenue; cleared when you pay tipped employees."
          >
            <AccountsSelect
              name="tipsLiabilityAccountId"
              items={accounts}
              filterByRootTypes={['liability']}
              fill
            />
          </FormGroup>
          <FormGroup
            label="Bank Account That Receives Payouts"
            helperText="Where Square deposits net sales. Used to auto-match payouts against bank feed transactions (Phase 3)."
          >
            <AccountsSelect
              name="depositBankAccountId"
              items={accounts}
              filterByTypes={['bank', 'cash']}
              fill
            />
          </FormGroup>
        </Card>

        <Card style={{ margin: 0 }}>
          <SectionTitle>Walk-In Customer</SectionTitle>
          <Text className={Classes.TEXT_MUTED} style={{ fontSize: 12, marginBottom: 8 }}>
            Anonymous Square sales (no customer attached) are posted against
            this customer. Create one up front if you don't already have one.
          </Text>
          <FormGroup label="Customer">
            <CustomersSelect
              name="walkInCustomerId"
              items={customers}
              popoverFill
              allowCreate
            />
          </FormGroup>
        </Card>

        <Card style={{ margin: 0 }}>
          <Group position="apart" style={{ marginBottom: 8 }}>
            <SectionTitle style={{ marginBottom: 0 }}>
              Advanced — Webhook Signature Key
            </SectionTitle>
            <Button
              minimal
              small
              icon={advancedOpen ? 'chevron-up' : 'chevron-down'}
              onClick={() => setAdvancedOpen((v) => !v)}
            >
              {advancedOpen ? 'Hide' : 'Show'}
            </Button>
          </Group>
          <Collapse isOpen={advancedOpen}>
            <Text className={Classes.TEXT_MUTED} style={{ fontSize: 12, marginBottom: 8 }}>
              The signature key is registered automatically when you connect.
              Only paste a value here if auto-registration failed (see the
              error above) or you rotated the subscription's signing key in
              Square's Developer Dashboard. {connection.squareWebhookSubscriptionId
                ? `Current subscription: ${connection.squareWebhookSubscriptionId}`
                : 'No subscription is registered yet.'}
            </Text>
            <FormGroup label="Webhook Signature Key">
              <InputGroup
                name="webhookSignatureKey"
                value={values.webhookSignatureKey}
                placeholder="Paste Square's signature_key here"
                onChange={(e) =>
                  setFieldValue('webhookSignatureKey', e.target.value)
                }
                fill
              />
            </FormGroup>
          </Collapse>
        </Card>

        <Card style={{ margin: 0 }}>
          <SectionTitle>Square Locations</SectionTitle>
          <Text className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
            For reference — all locations post under a single Bigcapital branch
            in v1. Per-location branching is planned for a future release.
          </Text>
          {!locations && <Spinner size={16} />}
          {locations &&
            locations.map((loc) => (
              <Group key={loc.id} spacing={8} style={{ marginTop: 8 }}>
                <Text>
                  <strong>{loc.name}</strong>
                  {loc.businessName ? ` (${loc.businessName})` : ''}
                </Text>
                {loc.address && (
                  <Text className={Classes.TEXT_MUTED}>{loc.address}</Text>
                )}
                <Text className={Classes.TEXT_MUTED} style={{ fontFamily: 'monospace', fontSize: 11 }}>
                  {loc.id}
                </Text>
              </Group>
            ))}
        </Card>
      </Stack>

      <Group position="apart" style={{ marginTop: 20 }}>
        <Button onClick={() => history.push('/preferences/integrations/square')}>
          Back
        </Button>
        <Button
          type="submit"
          intent={Intent.PRIMARY}
          disabled={!allAccountsPicked}
          loading={isSubmitting}
        >
          {allAccountsPicked ? 'Save & Activate' : 'Fill all selections'}
        </Button>
      </Group>
    </>
  );
}

const PageRoot = styled(Box)`
  width: 100%;
  max-width: 800px;
  margin: 20px;
`;

const SectionTitle = styled(Text)`
  font-weight: 600;
  margin-bottom: 12px;
`;
