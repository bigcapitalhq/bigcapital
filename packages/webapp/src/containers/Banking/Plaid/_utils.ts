import {
  PlaidLinkError,
  PlaidLinkOnEventMetadata,
  PlaidLinkOnExitMetadata,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkStableEvent,
} from 'react-plaid-link';

export const logEvent = (
  eventName: PlaidLinkStableEvent | string,
  metadata:
    | PlaidLinkOnEventMetadata
    | PlaidLinkOnSuccessMetadata
    | PlaidLinkOnExitMetadata,
  error?: PlaidLinkError | null,
) => {
  console.log(`Link Event: ${eventName}`, metadata, error);
};

export const logSuccess = async ({
  institution,
  accounts,
  link_session_id,
}: PlaidLinkOnSuccessMetadata) => {
  logEvent('onSuccess', {
    institution,
    accounts,
    link_session_id,
  });
};

export const logExit = async (
  error: PlaidLinkError | null,
  { institution, status, link_session_id, request_id }: PlaidLinkOnExitMetadata,
) => {
  logEvent(
    'onExit',
    {
      institution,
      status,
      link_session_id,
      request_id,
    },
    error,
  );
};
