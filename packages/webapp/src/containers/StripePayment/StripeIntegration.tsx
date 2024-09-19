import React, { useState } from 'react';
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from '@stripe/react-connect-js';
import { useStripeConnect } from './use-stripe-connect';
import { useCreateStripeAccount } from '@/hooks/query/stripe-integration';

export function StripeIntegration() {
  const [accountCreatePending, setAccountCreatePending] =
    useState<boolean>(false);
  const [onboardingExited, setOnboardingExited] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [connectedAccountId, setConnectedAccountId] = useState<string | null>(
    null,
  );
  const stripeConnectInstance = useStripeConnect(connectedAccountId || '');
  const { mutateAsync: createAccount } = useCreateStripeAccount();

  const handleSignupBtnClick = () => {
    setAccountCreatePending(true);
    setError(false);

    createAccount({})
      .then((account) => {
        setConnectedAccountId(account.account_id);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setAccountCreatePending(false);
      });
  };

  return (
    <div className="container">
      <div className="banner">
        <h2>Bigcapital Technology, Inc.</h2>
      </div>
      <div className="content">
        {!connectedAccountId && <h2>Get ready for take off</h2>}
        {connectedAccountId && !stripeConnectInstance && (
          <h2>Add information to start accepting money</h2>
        )}
        {!connectedAccountId && (
          <p>
            Bigcapital Technology, Inc. is the world's leading air travel
            platform: join our team of pilots to help people travel faster.
          </p>
        )}
        {!accountCreatePending && !connectedAccountId && (
          <div>
            <button onClick={handleSignupBtnClick}>Sign up</button>
          </div>
        )}
        {stripeConnectInstance && (
          <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
            <ConnectAccountOnboarding
              onExit={() => setOnboardingExited(true)}
            />
          </ConnectComponentsProvider>
        )}
        {error && <p className="error">Something went wrong!</p>}
        {(connectedAccountId || accountCreatePending || onboardingExited) && (
          <div className="dev-callout">
            {connectedAccountId && (
              <p>
                Your connected account ID is:{' '}
                <code className="bold">{connectedAccountId}</code>
              </p>
            )}
            {accountCreatePending && <p>Creating a connected account...</p>}
            {onboardingExited && (
              <p>The Account Onboarding component has exited</p>
            )}
          </div>
        )}
        <div className="info-callout">
          <p>
            This is a sample app for Connect onboarding using the Account
            Onboarding embedded component.{' '}
            <a
              href="https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=embedded"
              target="_blank"
              rel="noopener noreferrer"
            >
              View docs
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
