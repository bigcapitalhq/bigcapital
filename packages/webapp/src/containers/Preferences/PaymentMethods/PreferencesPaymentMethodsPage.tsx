// @ts-nocheck
import styled from 'styled-components';
import { Button, Classes, Intent, Text } from '@blueprintjs/core';
import { Box, Card, Group, Stack } from '@/components';
import { StripeLogo } from '@/icons/StripeLogo';
import { PaymentMethodsBoot } from './PreferencesPaymentMethodsBoot';

export default function PreferencesPaymentMethodsPage() {
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
      </PaymentMethodsBoot>
    </PaymentMethodsRoot>
  );
}

function StripePaymentMethod() {
  return (
    <Card style={{ margin: 0 }}>
      <Group position="apart">
        <StripeLogo />
        <Group>
          <Button intent={Intent.PRIMARY} small>
            Set it Up
          </Button>
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
