// @ts-nocheck
import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { AppToaster } from '@/components';

import withGlobalErrors from './withGlobalErrors';
import withGlobalErrorsActions from './withGlobalErrorsActions';
import { compose } from '@/utils';

let toastKeySessionExpired;
let toastKeySomethingWrong;
let toastTooManyRequests;

function GlobalErrors({
  // #withGlobalErrors
  globalErrors,

  // #withGlobalErrorsActions
  globalErrorsSet,
}) {
  if (globalErrors.something_wrong) {
    toastKeySessionExpired = AppToaster.show(
      {
        message: intl.get('ops_something_went_wrong'),
        intent: Intent.DANGER,
        onDismiss: () => {
          globalErrorsSet({ something_wrong: false });
        },
      },
      toastKeySessionExpired,
    );
  }
  if (globalErrors.session_expired) {
    toastKeySomethingWrong = AppToaster.show(
      {
        message: intl.get('session_expired'),
        intent: Intent.DANGER,
        onDismiss: () => {
          globalErrorsSet({ session_expired: false });
        },
      },
      toastKeySomethingWrong,
    );
  }
  if (globalErrors.too_many_requests) {
    toastTooManyRequests = AppToaster.show(
      {
        message: intl.get('global_error.too_many_requests'),
        intent: Intent.DANGER,
        onDismiss: () => {
          globalErrorsSet({ too_many_requests: false });
        },
      },
      toastTooManyRequests,
    );
  }
  if (globalErrors.access_denied) {
    toastKeySomethingWrong = AppToaster.show(
      {
        message: intl.get('global_error.you_dont_have_permissions'),
        intent: Intent.DANGER,
        onDismiss: () => {
          globalErrorsSet({ access_denied: false });
        },
      },
      toastKeySomethingWrong,
    );
  }
  if (globalErrors.transactionsLocked) {
    AppToaster.show({
      message: intl.get('global_error.transactions_locked', {
        lockedToDate: globalErrors.transactionsLocked.formatted_locked_to_date,
      }),
      intent: Intent.DANGER,
      onDismiss: () => {
        globalErrorsSet({ transactionsLocked: false });
      },
    });
  }
  if (globalErrors.subscriptionInactive) {
    AppToaster.show({
      message: `You can't add new data to Bigcapital because your subscription is inactive. Make sure your billing information is up-to-date from Preferences > Billing page.`,
      intent: Intent.DANGER,
      onDismiss: () => {
        globalErrorsSet({ subscriptionInactive: false });
      },
    });
  }
  if (globalErrors.userInactive) {
    AppToaster.show({
      message: intl.get('global_error.authorized_user_inactive'),
      intent: Intent.DANGER,
      onDismiss: () => {
        globalErrorsSet({ userInactive: false });
      },
    });
  }
  return null;
}

export default compose(withGlobalErrors, withGlobalErrorsActions)(GlobalErrors);
