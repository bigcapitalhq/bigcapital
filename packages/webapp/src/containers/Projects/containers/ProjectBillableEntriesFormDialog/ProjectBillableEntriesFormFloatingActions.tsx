// @ts-nocheck

import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { Intent, Button, Classes } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import { useProjectBillableEntriesFormContext } from './ProjectBillableEntriesFormProvider';
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
  const { isSubmitting, values } = useFormikContext();

  const { dialogName } = useProjectBillableEntriesFormContext();

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
          <T id={'save'} />
        </SaveButton>
        <Button onClick={handleCancelBtnClick} disabled={isSubmitting}>
          <T id={'cancel'} />
        </Button>
      </div>
    </div>
  );
}

export default compose(withDialogActions)(ProjectEntriesFormFloatingActions);

const SaveButton = styled(Button)`
  &.bp4-button {
    margin-left: 0px;
  }
`;
