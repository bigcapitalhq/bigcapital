// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import {
  Button,
  Classes,
  Intent,
  Menu,
  MenuItem,
  Popover,
  Tag,
  Text,
  Tooltip,
} from '@blueprintjs/core';
import { Box, Card, Group, Stack } from '@/components';
import { StripeLogo } from '@/icons/StripeLogo';
import { usePaymentMethodsBoot } from './PreferencesPaymentMethodsBoot';
import { DialogsName } from '@/constants/dialogs';
import {
  useAlertActions,
  useDialogActions,
  useDrawerActions,
} from '@/hooks/state';
import { DRAWERS } from '@/constants/drawers';
import { MoreIcon } from '@/icons/More';
import { STRIPE_PRICING_LINK } from './constants';

export function StripePaymentMethod() {
  const { openDialog } = useDialogActions();
  const { openDrawer } = useDrawerActions();
  const { openAlert } = useAlertActions();

  const { paymentMethodsState } = usePaymentMethodsBoot();
  const stripeState = paymentMethodsState?.stripe;

  const isAccountCreated = stripeState?.isStripeAccountCreated;
  const isPaymentEnabled = stripeState?.isStripePaymentEnabled;
  const isPayoutEnabled = stripeState?.isStripePayoutEnabled;
  const isStripeEnabled = stripeState?.isStripeEnabled;
  const stripePaymentMethodId = stripeState?.stripePaymentMethodId;
  const isStripeServerConfigured = stripeState?.isStripeServerConfigured;

  // Handle Stripe setup button click.
  const handleSetUpBtnClick = () => {
    openDialog(DialogsName.StripeSetup);
  };

  // Handle edit button click.
  const handleEditBtnClick = () => {
    openDrawer(DRAWERS.STRIPE_PAYMENT_INTEGRATION_EDIT, {
      stripePaymentMethodId: stripePaymentMethodId,
    });
  };

  // Handle delete connection button click.
  const handleDeleteConnectionClick = () => {
    openAlert('delete-stripe-payment-method', {
      paymentMethodId: stripePaymentMethodId,
    });
  };

  return (
    <Card style={{ margin: 0 }}>
      <Group position="apart">
        <Group>
          <StripeLogo />

          <Group spacing={10}>
            {isStripeEnabled && (
              <Tag minimal intent={Intent.SUCCESS}>
                Active
              </Tag>
            )}
            {!isPaymentEnabled && isAccountCreated && (
              <Tooltip content="The account cannot accept payments because verification may be incomplete, there may be legal or compliance issues, or required documents haven't been submitted or verified.">
                <Tag minimal intent={Intent.DANGER}>
                  Payment Not Enabled
                </Tag>
              </Tooltip>
            )}
            {!isPayoutEnabled && isAccountCreated && (
              <Tooltip content="The account cannot receive payouts due to incomplete or invalid bank details, pending identity verification, or compliance restrictions.">
                <Tag minimal intent={Intent.DANGER}>
                  Payout Not Enabled
                </Tag>
              </Tooltip>
            )}
          </Group>
        </Group>
        <Group spacing={10}>
          {isAccountCreated && (
            <Button small onClick={handleEditBtnClick}>
              Edit
            </Button>
          )}
          {!isAccountCreated && (
            <Button intent={Intent.PRIMARY} small onClick={handleSetUpBtnClick}>
              Set it Up
            </Button>
          )}
          {isAccountCreated && (
            <Popover
              content={
                <Menu>
                  <MenuItem
                    intent={Intent.DANGER}
                    text={'Delete Connection'}
                    onClick={handleDeleteConnectionClick}
                  />
                </Menu>
              }
            >
              <Button small icon={<MoreIcon height={10} width={10} />} />
            </Popover>
          )}
        </Group>
      </Group>

      <PaymentDescription
        className={Classes.TEXT_MUTED}
        style={{ fontSize: 13 }}
      >
        Stripe is a secure online payment platform that lets you easily accept
        both one-time and recurring payments. It simplifies managing
        transactions and streamlines reconciliation. Setup is quick, helping you
        get paid faster and more efficiently.
      </PaymentDescription>

      <PaymentFooter>
        <Stack spacing={10}>
          <Text>
            <a target="_blank" rel="noreferrer" href={STRIPE_PRICING_LINK}>
              View Stripe's Transaction Fees
            </a>
          </Text>

          {!isStripeServerConfigured && (
            <Text style={{ color: '#CD4246' }}>
              Stripe payment is not configured from the server.{' '}
            </Text>
          )}
        </Stack>
      </PaymentFooter>
    </Card>
  );
}

const PaymentDescription = styled(Text)`
  font-size: 13px;
  margin-top: 12px;
`;

const PaymentFooter = styled(Box)`
  margin-top: 14px;
  font-size: 12px;
`;
