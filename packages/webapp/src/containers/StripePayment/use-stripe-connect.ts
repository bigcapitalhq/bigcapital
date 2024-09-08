import { useState, useEffect } from 'react';
import {
  loadConnectAndInitialize,
  StripeConnectInstance,
} from '@stripe/connect-js';
import { useCreateStripeAccountSession } from '@/hooks/query/stripe-integration';

export const useStripeConnect = (connectedAccountId?: string) => {
  const [stripeConnectInstance, setStripeConnectInstance] =
    useState<StripeConnectInstance | null>();
  const { mutateAsync: createAccountSession } = useCreateStripeAccountSession();

  useEffect(() => {
    if (connectedAccountId) {
      const fetchClientSecret = async (): Promise<string> => {
        try {
          const clientSecret = await createAccountSession({
            connectedAccountId,
          });
          return clientSecret?.client_secret as string;
        } catch (error) {
          // Handle errors on the client side here
          if (error instanceof Error) {
            throw new Error(`An error occurred: ${error.message}`);
          } else {
            throw new Error('An unknown error occurred');
          }
        }
      };

      setStripeConnectInstance(
        loadConnectAndInitialize({
          publishableKey: 'pk_test_51PRck9BW396nDn7gxEw1uvkoGwl5BXDWnrhntQIWReiDnH2Zdm7uL0RSvzKN6SR6ELHDK99dF9UbVEumgTu8k0oN00pP0J91Lx',
          fetchClientSecret,
          appearance: {
            overlays: 'dialog',
            variables: {
              colorPrimary: '#ffffff',
            },
          },
        }),
      );
    }
  }, [connectedAccountId, createAccountSession]);

  return stripeConnectInstance;
};
