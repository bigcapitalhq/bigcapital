import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { AppToaster } from '@/components';

export interface BranchError {
  type: string;
}

/**
 * Handle delete errors.
 */
export const handleDeleteErrors = (errors: BranchError[]) => {
  if (errors.find((error) => error.type === 'COULD_NOT_DELETE_ONLY_BRANCH')) {
    AppToaster.show({
      message: intl.get('branch.error.could_not_delete_only_branch'),
      intent: Intent.DANGER,
    });
  }
  if (errors.some((e) => e.type === 'BRANCH_HAS_ASSOCIATED_TRANSACTIONS')) {
    AppToaster.show({
      message: intl.get('branche.error.branch_has_associated_transactions'),
      intent: Intent.DANGER,
    });
  }
};
