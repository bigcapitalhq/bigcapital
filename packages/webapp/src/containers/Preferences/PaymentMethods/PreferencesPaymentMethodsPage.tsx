// @ts-nocheck
import React, { useEffect } from 'react';
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
import {
  PaymentMethodsBoot,
  usePaymentMethodsBoot,
} from './PreferencesPaymentMethodsBoot';
import { StripePreSetupDialog } from './dialogs/StripePreSetupDialog/StripePreSetupDialog';
import { DialogsName } from '@/constants/dialogs';
import {
  useAlertActions,
  useChangePreferencesPageTitle,
  useDialogActions,
  useDrawerActions,
} from '@/hooks/state';
import { useCreateStripeAccountLink } from '@/hooks/query/stripe-integration';
import { StripeIntegrationEditDrawer } from './drawers/StripeIntegrationEditDrawer';
import { DRAWERS } from '@/constants/drawers';
import { MoreIcon } from '@/icons/More';

export default function PreferencesPaymentMethodsPage() {
  const changePageTitle = useChangePreferencesPageTitle();

  useEffect(() => {
    changePageTitle('Payment Methods');
  }, [changePageTitle]);

  return (
    <PaymentMethodsRoot>
      <PaymentMethodsBoot>
        <Text className={Classes.TEXT_MUTED} style={{ marginBottom: 20 }}>
          Accept payments from all the major debit and credit card networks
          through the supported payment gateways.
        </Text>

        <Stack>
          <StripePaymentMethod />
        </Stack>

        <StripePreSetupDialog dialogName={DialogsName.StripeSetup} />
        <StripeIntegrationEditDrawer
          name={DRAWERS.STRIPE_PAYMENT_INTEGRATION_EDIT}
        />
      </PaymentMethodsBoot>
    </PaymentMethodsRoot>
  );
}

function StripePaymentMethod() {
  const { openDialog } = useDialogActions();
  const { openDrawer } = useDrawerActions();
  const { openAlert } = useAlertActions();

  const { paymentMethodsState } = usePaymentMethodsBoot();
  const stripeState = paymentMethodsState?.stripe;

  const isAccountCreated = stripeState?.isStripeAccountCreated;
  const isAccountActive = stripeState?.isStripePaymentActive;
  const stripeAccountId = stripeState?.stripeAccountId;
  const stripePaymentMethodId = stripeState?.stripePaymentMethodId;

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
    openDrawer(DRAWERS.STRIPE_PAYMENT_INTEGRATION_EDIT);
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
          <Button small onClick={handleEditBtnClick}>
            Edit
          </Button>

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
        Stripe is an online payment processing platform that allows you to
        receive one-time and recurring payments securely from customers. It also
        manages all your payments and makes reconciliation a breeze. You can set
        it up in no time and get paid faster. 
      </PaymentDescription>

      <PaymentFooter>
        <Text>
          <a href={'#'}>View Stripe's Transaction Fees</a>
        </Text>
      </PaymentFooter>
    </Card>
  );
}

const PaymentMethodsRoot = styled(Box)`
  witdth: 100%;
  max-width: 700px;
  margin: 20px;
`;

const PaymentDescription = styled(Text)`
  font-size: 13px;
  margin-top: 12px;
`;

const PaymentFooter = styled(Box)`
  margin-top: 14px;
  font-size: 12px;
`;
