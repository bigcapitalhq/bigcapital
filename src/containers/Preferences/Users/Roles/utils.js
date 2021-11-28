import intl from 'react-intl-universal';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';

// handle delete errors.
export const handleDeleteErrors = (errors) => {
  if (errors.find((error) => error.type === 'ROLE_PREFINED')) {
    AppToaster.show({
      message: intl.get('roles.error.role_is_predefined'),
      intent: Intent.DANGER,
    });
  }
};
