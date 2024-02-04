// @ts-nocheck
import React, { useEffect } from 'react';
import {
  usePlaidLink,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOnExitMetadata,
  PlaidLinkError,
  PlaidLinkOptionsWithLinkToken,
  PlaidLinkOnEventMetadata,
  PlaidLinkStableEvent,
} from 'react-plaid-link';
import { logEvent, logExit, logSuccess } from './_utils';
import { usePlaidExchangeToken } from '@/hooks/query';
import { useResetBankingPlaidToken } from '@/hooks/state/banking';

interface PlaidLaunchLinkProps {
  token: string;
  itemId?: number | null;
  children?: React.ReactNode;
}

/**
 * Uses the usePlaidLink hook to manage the Plaid Link creation.
 * See https://github.com/plaid/react-plaid-link for full usage instructions.
 * The link token passed to usePlaidLink cannot be null.
 * It must be generated outside of this component.  In this sample app, the link token
 * is generated in the link context in client/src/services/link.js.
 *
 * @param {PlaidLaunchLinkProps} props
 * @returns {React.ReactNode}
 */
export function LaunchLink(props: PlaidLaunchLinkProps) {
  const resetPlaidToken = useResetBankingPlaidToken();
  const { mutateAsync: exchangeAccessToken } = usePlaidExchangeToken();

  // define onSuccess, onExit and onEvent functions as configs for Plaid Link creation
  const onSuccess = async (
    publicToken: string,
    metadata: PlaidLinkOnSuccessMetadata,
  ) => {
    // log and save metatdata
    logSuccess(metadata);
    if (props.itemId != null) {
      // update mode: no need to exchange public token
      // await setItemState(props.itemId, 'good');
      // deleteLinkToken(null, props.itemId);
      // getItemById(props.itemId, true);
      // regular link mode: exchange public token for access token
    } else {
      await exchangeAccessToken({
        public_token: publicToken,
        institution_id: metadata.institution.institution_id,
      });
    }
    // resetError();
    resetPlaidToken();
  };

  // Handle other error codes, see https://plaid.com/docs/errors/
  const onExit = async (
    error: PlaidLinkError | null,
    metadata: PlaidLinkOnExitMetadata,
  ) => {
    // log and save error and metatdata
    logExit(error, metadata, props.userId);
    if (error != null) {
      // setError(error.error_code, error.display_message || error.error_message);
    }
    resetPlaidToken();
  };

  const onEvent = async (
    eventName: PlaidLinkStableEvent | string,
    metadata: PlaidLinkOnEventMetadata,
  ) => {
    // handle errors in the event end-user does not exit with onExit function error enabled.
    if (eventName === 'ERROR' && metadata.error_code != null) {
      // setError(metadata.error_code, ' ');
    }
    logEvent(eventName, metadata);
  };

  const config: PlaidLinkOptionsWithLinkToken = {
    onSuccess,
    onExit,
    onEvent,
    token: props.token,
  };

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    // initiallizes Link automatically
    if (ready) {
      open();
    }
  }, [ready, open, props.itemId, props.token]);

  return <></>;
}
