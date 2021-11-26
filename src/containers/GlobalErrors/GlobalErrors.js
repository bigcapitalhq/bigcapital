import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import AppToaster from 'components/AppToaster';

import withGlobalErrors from './withGlobalErrors';
import withGlobalErrorsActions from './withGlobalErrorsActions';
import { compose } from 'utils';

let toastKeySessionExpired;
let toastKeySomethingWrong;

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
  if (globalErrors.access_denied) {
    toastKeySomethingWrong = AppToaster.show(
      {
        message: 'You do not have permissions to access this page.',
        intent: Intent.DANGER,
        onDismiss: () => {
          globalErrorsSet({ access_denied: false });
        },
      },
      toastKeySomethingWrong,
    );
  }
  return null;
}

export default compose(withGlobalErrors, withGlobalErrorsActions)(GlobalErrors);
