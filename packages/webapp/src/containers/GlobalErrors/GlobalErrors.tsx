import { Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import intl from 'react-intl-universal';
import { withGlobalErrors } from './withGlobalErrors';
import { withGlobalErrorsActions } from './withGlobalErrorsActions';
import type { WithGlobalErrorsProps } from './withGlobalErrors';
import type { WithGlobalErrorsActionsProps } from './withGlobalErrorsActions';
import { AppToaster } from '@/components';

let toastKeySomethingWrong: string | undefined;
let toastKeySessionExpired: string | undefined;
let toastKeyTooManyRequests: string | undefined;
let toastKeyAccessDenied: string | undefined;

interface GlobalErrorsInnerProps
  extends WithGlobalErrorsProps,
    WithGlobalErrorsActionsProps {}

function GlobalErrorsInner({
  // #withGlobalErrors
  globalErrors,

  // #withGlobalErrorsActions
  globalErrorsSet,
}: GlobalErrorsInnerProps) {
  if (globalErrors.something_wrong) {
    toastKeySomethingWrong = AppToaster.show(
      {
        message: intl.get('ops_something_went_wrong'),
        intent: Intent.DANGER,
        onDismiss: () => {
          globalErrorsSet({ something_wrong: false });
        },
      },
      toastKeySomethingWrong,
    );
  }
  if (globalErrors.session_expired) {
    toastKeySessionExpired = AppToaster.show(
      {
        message: intl.get('session_expired'),
        intent: Intent.DANGER,
        onDismiss: () => {
          globalErrorsSet({ session_expired: false });
        },
      },
      toastKeySessionExpired,
    );
  }
  if (globalErrors.too_many_requests) {
    toastKeyTooManyRequests = AppToaster.show(
      {
        message: intl.get('global_error.too_many_requests'),
        intent: Intent.DANGER,
        onDismiss: () => {
          globalErrorsSet({ too_many_requests: false });
        },
      },
      toastKeyTooManyRequests,
    );
  }
  if (globalErrors.access_denied) {
    toastKeyAccessDenied = AppToaster.show(
      {
        message:
          globalErrors.access_denied.message ||
          intl.get('global_error.you_dont_have_permissions'),
        intent: Intent.DANGER,
        onDismiss: () => {
          globalErrorsSet({ access_denied: undefined });
        },
      },
      toastKeyAccessDenied,
    );
  }
  if (globalErrors.transactionsLocked) {
    AppToaster.show({
      message: intl.get('global_error.transactions_locked', {
        lockedToDate: globalErrors.transactionsLocked.formattedLockedToDate,
      }),
      intent: Intent.DANGER,
      onDismiss: () => {
        globalErrorsSet({ transactionsLocked: undefined });
      },
    });
  }
  if (globalErrors.subscriptionInactive) {
    AppToaster.show({
      message: `You can't add new data to Bigcapital because your subscription is inactive. Make sure your billing information is up-to-date from Preferences > Billing page.`,
      intent: Intent.DANGER,
      onDismiss: () => {
        globalErrorsSet({ subscriptionInactive: undefined });
      },
    });
  }
  if (globalErrors.userInactive) {
    AppToaster.show({
      message: intl.get('global_error.authorized_user_inactive'),
      intent: Intent.DANGER,
      onDismiss: () => {
        globalErrorsSet({ userInactive: undefined });
      },
    });
  }
  return null;
}

export const GlobalErrors = FF.pipe(
  GlobalErrorsInner,
  withGlobalErrorsActions,
  withGlobalErrors,
);
