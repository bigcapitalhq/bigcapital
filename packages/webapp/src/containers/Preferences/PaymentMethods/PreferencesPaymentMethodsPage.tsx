import { Classes, Text } from '@blueprintjs/core';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { StripePreSetupDialog } from './dialogs/StripePreSetupDialog/StripePreSetupDialog';
import { StripeIntegrationEditDrawer } from './drawers/StripeIntegrationEditDrawer';
import { PaymentMethodsBoot } from './PreferencesPaymentMethodsBoot';
import { StripePaymentMethod } from './StripePaymentMethod';
import { Box, Stack } from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { DRAWERS } from '@/constants/drawers';
import { useChangePreferencesPageTitle } from '@/hooks/state';

/**
 * Payment methods page.
 */
export function PreferencesPaymentMethodsPage() {
  const changePageTitle = useChangePreferencesPageTitle();

  useEffect(() => {
    changePageTitle('Payment Methods');
  }, [changePageTitle]);

  return (
    <PaymentMethodsRoot>
      <PaymentMethodsBoot>
        <Text className={Classes.TEXT_MUTED} style={{ marginBottom: 20 }}>
          Accept payments from all the major debit and credit card networks
          through the supported payment methods.
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

const PaymentMethodsRoot = styled(Box)`
  witdth: 100%;
  max-width: 700px;
  margin: 20px;
`;
