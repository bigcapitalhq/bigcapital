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
} from '@blueprintjs/core';
import { AppToaster, Box, Card, Group, Stack } from '@/components';
import { StripeLogo } from '@/icons/StripeLogo';
import { usePaymentMethodsBoot } from './PreferencesPaymentMethodsBoot';
import { DialogsName } from '@/constants/dialogs';
import {
  useAlertActions,
  useDialogActions,
  useDrawerActions,
} from '@/hooks/state';
import { useCreateStripeAccountLink } from '@/hooks/query/stripe-integration';
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
  const isAccountActive = stripeState?.isStripePaymentActive;
  const stripeAccountId = stripeState?.stripeAccountId;
  const stripePaymentMethodId = stripeState?.stripePaymentMethodId;
  const isStripeServerConfigured = stripeState?.isStripeServerConfigured;

  const {
    mutateAsync: createStripeAccountLink,
    isLoading: isCreateStripeLinkLoading,
  } = useCreateStripeAccountLink();

  // Handle Stripe setup button click.
  const handleSetUpBtnClick = () => {
    openDialog(DialogsName.StripeSetup);
  };

  // Handle complete Stripe setup button click.
  const handleCompleteSetUpBtnClick = () => {
    createStripeAccountLink({ stripeAccountId })
      .then((res) => {
        const { clientSecret } = res;

        if (clientSecret.url) {
          window.open(clientSecret.url, '_blank');
        }
      })
      .catch(() => {
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
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

          {isAccountActive && (
            <Tag minimal intent={Intent.SUCCESS}>
              Active
            </Tag>
          )}
        </Group>
        <Group spacing={10}>
          {isAccountActive && (
            <Button small onClick={handleEditBtnClick}>
              Edit
            </Button>
          )}
          {!isAccountCreated && (
            <Button intent={Intent.PRIMARY} small onClick={handleSetUpBtnClick}>
              Set it Up
            </Button>
          )}
          {isAccountCreated && !isAccountActive && (
            <Button
              intent={Intent.PRIMARY}
              small
              onClick={handleCompleteSetUpBtnClick}
              loading={isCreateStripeLinkLoading}
            >
              Complete Stripe Set Up
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
              <Button small icon={<MoreIcon size={16} />} />
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
