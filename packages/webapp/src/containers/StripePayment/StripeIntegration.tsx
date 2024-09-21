import React, { useState } from 'react';
import {
  useCreateStripeAccount,
  useCreateStripeAccountLink,
} from '@/hooks/query/stripe-integration';

export const StripeIntegration2 = () => {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] =
    useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState<string>();
  const { mutateAsync: createStripeAccount } = useCreateStripeAccount();
  const { mutateAsync: createStripeAccountLink } = useCreateStripeAccountLink();

  return (
    <div className="container">
      <div className="banner">
        <h2>Bigcapital Technology, Inc.</h2>
      </div>
      <div className="content">
        {!connectedAccountId && <h2>Get ready for take off</h2>}
        {!connectedAccountId && (
          <p>
            Bigcapital Technology, Inc. is the world's leading air travel
            platform: join our team of pilots to help people travel faster.
          </p>
        )}
        {connectedAccountId && (
          <h2>Add information to start accepting money</h2>
        )}
        {connectedAccountId && (
          <p>
            Matt's Mats partners with Stripe to help you receive payments and
            keep your personal bank and details secure.
          </p>
        )}
        {!accountCreatePending && !connectedAccountId && (
          <button
            onClick={async () => {
              setAccountCreatePending(true);
              setError(false);
              createStripeAccount({}).then((response) => {
                const { account_id: accountId } = response;
                setAccountCreatePending(false);

                if (accountId) {
                  setConnectedAccountId(accountId);
                }
                if (error) {
                  setError(true);
                }
              });
            }}
          >
            Create an account!
          </button>
        )}
        {connectedAccountId && !accountLinkCreatePending && (
          <button
            onClick={() => {
              setAccountLinkCreatePending(true);
              setError(false);
              createStripeAccountLink({
                stripeAccountId: connectedAccountId,
              })
                .then((res) => {
                  const { clientSecret } = res;
                  setAccountLinkCreatePending(false);

                  if (clientSecret.url) {
                    window.location.href = clientSecret.url;
                  }
                })
                .catch(() => {
                  setError(true);
                });
            }}
          >
            Add information
          </button>
        )}
        {error && <p className="error">Something went wrong!</p>}
        {(connectedAccountId ||
          accountCreatePending ||
          accountLinkCreatePending) && (
          <div className="dev-callout">
            {connectedAccountId && (
              <p>
                Your connected account ID is:{' '}
                <code className="bold">{connectedAccountId}</code>
              </p>
            )}
            {accountCreatePending && <p>Creating a connected account...</p>}
            {accountLinkCreatePending && <p>Creating a new Account Link...</p>}
          </div>
        )}
        <div className="info-callout">
          <p>
            This is a sample app for Stripe-hosted Connect onboarding.{' '}
            <a
              href="https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=hosted"
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
};
