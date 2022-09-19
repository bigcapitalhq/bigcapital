import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { Intent, Button, Classes } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

/**
 * project entries from floating actions.
 * @return
 */
function ProjectEntriesFormFloatingActions({
  // #withDialogActions
  closeDialog,
}) {
  // Formik context.
  const { isSubmitting } = useFormikContext();

  // Handle close button click.
  const handleCancelBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <SaveButton
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          type="submit"
        >
          Save
        </SaveButton>
      </div>
    </div>
  );
}

export default compose(withDialogActions)(ProjectEntriesFormFloatingActions);

const SaveButton = styled(Button)`
  &.bp3-button {
    min-width: 80px;
    border-radius: 16px;
    margin-left: 0px;
  }
`;
