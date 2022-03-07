import intl from 'react-intl-universal';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';

/**
 * Handle delete errors.
 */
export const handleDeleteErrors = (errors) => {
  if (errors.find((error) => error.type === 'COULD_NOT_DELETE_ONLY_BRANCH')) {
    AppToaster.show({
      message: intl.get('branch.error.could_not_delete_only_branch'),
      intent: Intent.DANGER,
    });
  }
};
