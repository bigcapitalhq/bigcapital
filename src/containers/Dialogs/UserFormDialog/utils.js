import intl from 'react-intl-universal';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';

// handle delete errors.
export const transformErrors = (errors) => {
  if (
    errors.find((error) => error.type === 'CANNOT_AUTHORIZED_USER_MUTATE_ROLE')
  ) {
    AppToaster.show({
      message: intl.get('roles.error.you_cannot_change_your_own_role'),
      intent: Intent.DANGER,
    });
  }
};
