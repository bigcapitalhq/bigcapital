// @ts-nocheck
import { usePlaidExchangeToken } from '@/hooks/query';
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
import { useHistory } from 'react-router-dom';
// import { exchangeToken, setItemState } from '../services/api';
// import { useItems, useLink, useErrors } from '../services';

interface LaunchLinkProps {
  isOauth?: boolean;
  token: string;
  userId: number;
  itemId?: number | null;
  children?: React.ReactNode;
}

// Uses the usePlaidLink hook to manage the Plaid Link creation.  See https://github.com/plaid/react-plaid-link for full usage instructions.
// The link token passed to usePlaidLink cannot be null.  It must be generated outside of this component.  In this sample app, the link token
// is generated in the link context in client/src/services/link.js.

export function LaunchLink(props: LaunchLinkProps) {
  const history = useHistory();
  // const { getItemsByUser, getItemById } = useItems();
  // const { generateLinkToken, deleteLinkToken } = useLink();
  // const { setError, resetError } = useErrors();

  const { mutateAsync: exchangeAccessToken } = usePlaidExchangeToken();

  // define onSuccess, onExit and onEvent functions as configs for Plaid Link creation
  const onSuccess = async (
    publicToken: string,
    metadata: PlaidLinkOnSuccessMetadata,
  ) => {
    // log and save metatdata
    // logSuccess(metadata, props.userId);
    if (props.itemId != null) {
      // update mode: no need to exchange public token
      // await setItemState(props.itemId, 'good');
      // deleteLinkToken(null, props.itemId);
      // getItemById(props.itemId, true);
      // regular link mode: exchange public token for access token
    } else {
      // call to Plaid api endpoint: /item/public_token/exchange in order to obtain access_token which is then stored with the created item
      debugger;

      await exchangeAccessToken({
        public_token: publicToken,
        institution_id: metadata.institution.institution_id,
      });
      // await exchangeToken(
      //   publicToken,
      //   metadata.institution,
      //   metadata.accounts,
      //   props.userId,
      // );
      // getItemsByUser(props.userId, true);
    }
    // resetError();
    // deleteLinkToken(props.userId, null);
    history.push(`/user/${props.userId}`);
  };

  const onExit = async (
    error: PlaidLinkError | null,
    metadata: PlaidLinkOnExitMetadata,
  ) => {
    // log and save error and metatdata
    // logExit(error, metadata, props.userId);
    if (error != null && error.error_code === 'INVALID_LINK_TOKEN') {
      // await generateLinkToken(props.userId, props.itemId);
    }
    if (error != null) {
      // setError(error.error_code, error.display_message || error.error_message);
    }
    // to handle other error codes, see https://plaid.com/docs/errors/
  };

  const onEvent = async (
    eventName: PlaidLinkStableEvent | string,
    metadata: PlaidLinkOnEventMetadata,
  ) => {
    // handle errors in the event end-user does not exit with onExit function error enabled.
    if (eventName === 'ERROR' && metadata.error_code != null) {
      // setError(metadata.error_code, ' ');
    }
    // logEvent(eventName, metadata);
  };

  const config: PlaidLinkOptionsWithLinkToken = {
    onSuccess,
    onExit,
    onEvent,
    token: props.token,
  };

  if (props.isOauth) {
    // add additional receivedRedirectUri config when handling an OAuth reidrect
    config.receivedRedirectUri = window.location.href;
  }
  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    // initiallizes Link automatically
    if (props.isOauth && ready) {
      open();
    } else if (ready) {
      // regular, non-OAuth case:
      // set link token, userId and itemId in local storage for use if needed later by OAuth

      localStorage.setItem(
        'oauthConfig',
        JSON.stringify({
          userId: props.userId,
          itemId: props.itemId,
          token: props.token,
        }),
      );
      open();
    }
  }, [ready, open, props.isOauth, props.userId, props.itemId, props.token]);

  return <></>;
}
