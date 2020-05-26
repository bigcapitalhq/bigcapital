import { Intent } from '@blueprintjs/core';
import { useIntl } from 'react-intl';
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
  const { formatMessage } = useIntl();

  if (globalErrors.something_wrong) {
    toastKeySessionExpired = AppToaster.show({
      message: formatMessage({ id: 'ops_something_went_wrong' }),
      intent: Intent.DANGER,
      onDismiss: () => {
        globalErrorsSet({ something_wrong: false });
      }
    }, toastKeySessionExpired);
  }

  if (globalErrors.session_expired) {
    toastKeySomethingWrong = AppToaster.show({
      message: formatMessage({ id: 'session_expired' }),
      intent: Intent.DANGER,
      onDismiss: () => {
        globalErrorsSet({ session_expired: false });
      }
    }, toastKeySomethingWrong);
  }

  return null;
}

export default compose(
  withGlobalErrors,
  withGlobalErrorsActions,
)(GlobalErrors);