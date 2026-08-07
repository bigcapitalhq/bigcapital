// @ts-nocheck

import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { useProjectBillableEntriesFormContext } from './ProjectBillableEntriesFormProvider';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
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

export const ProjectBillableEntriesFormFloatingActions = compose(
  withDialogActions,
)(ProjectEntriesFormFloatingActions);

const SaveButton = styled(Button)`
  &.bp4-button {
    margin-left: 0px;
  }
`;
