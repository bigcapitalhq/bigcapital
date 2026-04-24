// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  Button,
  Callout,
  Classes,
  FormGroup,
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

/**
 * Post-OAuth wizard: user picks the Clearing / Fees / Tips accounts, the
 * walk-in customer, and the bank account that receives Square payouts.
 * Once all five selections are made the server auto-promotes the
 * connection from `pending` to `active`.
 *
 * Tips are booked as a LIABILITY (Tips Payable) — cleared when the owner
 * pays out tips as wages — not recognized as revenue.
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
  const { data: accounts = [] } = useAccounts();
  const { data: customersResp } = useCustomers();
  const customers = customersResp?.customers ?? [];
  const { data: locations } = useSquareLocations(connectionId);
  const { mutateAsync: updateSettings, isLoading: saving } =
    useUpdateSquareSettings(connectionId);

  const [form, setForm] = useState<Partial<SquareConnection>>({});

  useEffect(() => {
    if (connection) {
      setForm({
        clearingAccountId: connection.clearingAccountId,
        feesExpenseAccountId: connection.feesExpenseAccountId,
        tipsLiabilityAccountId: connection.tipsLiabilityAccountId,
        walkInCustomerId: connection.walkInCustomerId,
        depositBankAccountId: connection.depositBankAccountId,
      });
    }
  }, [connection]);

  const allAccountsPicked = useMemo(
    () =>
      !!form.clearingAccountId &&
      !!form.feesExpenseAccountId &&
      !!form.tipsLiabilityAccountId &&
      !!form.walkInCustomerId &&
      !!form.depositBankAccountId,
    [form],
  );

  const setField = (key: keyof SquareConnection) => (value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    try {
      const updated = await updateSettings(form as any);
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

      <Stack spacing={12}>
        <Card style={{ margin: 0 }}>
          <SectionTitle>Accounts</SectionTitle>
          <FormGroup
            label="Square Clearing Account"
            helperText="Other Current Asset. Holds gross Square sales between sale time and payout arrival."
          >
            <AccountsSelect
              name="clearingAccount"
              items={accounts}
              selectedAccountId={form.clearingAccountId}
              onAccountSelected={(a) => setField('clearingAccountId')(a.id)}
              filterByRootTypes={['asset']}
              fill
            />
          </FormGroup>
          <FormGroup
            label="Merchant Processing Fees"
            helperText="Expense account. Square's per-transaction fee auto-posts here."
          >
            <AccountsSelect
              name="feesExpenseAccount"
              items={accounts}
              selectedAccountId={form.feesExpenseAccountId}
              onAccountSelected={(a) => setField('feesExpenseAccountId')(a.id)}
              filterByRootTypes={['expense']}
              fill
            />
          </FormGroup>
          <FormGroup
            label="Tips Payable"
            helperText="Liability account. Tip portion of each sale credits here instead of revenue; cleared when you pay tipped employees."
          >
            <AccountsSelect
              name="tipsLiabilityAccount"
              items={accounts}
              selectedAccountId={form.tipsLiabilityAccountId}
              onAccountSelected={(a) =>
                setField('tipsLiabilityAccountId')(a.id)
              }
              filterByRootTypes={['liability']}
              fill
            />
          </FormGroup>
          <FormGroup
            label="Bank Account That Receives Payouts"
            helperText="Where Square deposits net sales. Used to auto-match payouts against bank feed transactions (Phase 3)."
          >
            <AccountsSelect
              name="depositBankAccount"
              items={accounts}
              selectedAccountId={form.depositBankAccountId}
              onAccountSelected={(a) => setField('depositBankAccountId')(a.id)}
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
              name="walkInCustomer"
              items={customers}
              selectedCustomerId={form.walkInCustomerId}
              onContactSelected={(c) => setField('walkInCustomerId')(c.id)}
              popoverFill
              allowCreate
            />
          </FormGroup>
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
          intent={Intent.PRIMARY}
          disabled={!allAccountsPicked}
          loading={saving}
          onClick={handleSave}
        >
          {allAccountsPicked ? 'Save & Activate' : 'Fill all selections'}
        </Button>
      </Group>
    </PageRoot>
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
