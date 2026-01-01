// @ts-nocheck
import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { Form, useFormikContext } from 'formik';
import {
  FSelect,
  FieldRequiredHint,
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
} from '@/components';
import { CLASSES } from '@/constants/classes';
import { compose } from '@/utils';
import { useInviteUserFormContext } from './InviteUserFormProvider';

import { withDialogActions } from '@/containers/Dialog/withDialogActions';

function InviteUserFormContent({
  // #withDialogActions
  closeDialog,
}) {
  const { isSubmitting } = useFormikContext();
  const { isEditMode, dialogName, roles } = useInviteUserFormContext();

  const handleClose = () => {
    closeDialog(dialogName);
  };

  return (
    <Form>
      <div className={CLASSES.DIALOG_BODY}>
        <p className="mb2">
          <T id={'your_access_to_your_team'} />
        </p>
        {/* ----------- Email ----------- */}
        <FFormGroup
          name={'email'}
          label={<T id={'invite_user.label.email'} />}
          labelInfo={<FieldRequiredHint />}
        >
          <FInputGroup name={'email'} />
        </FFormGroup>
        {/* ----------- Role name ----------- */}
        <FFormGroup
          name={'role_id'}
          label={<T id={'invite_user.label.role_name'} />}
          labelInfo={<FieldRequiredHint />}
        >
          <FSelect
            name={'role_id'}
            items={roles}
            valueAccessor={'id'}
            textAccessor={'name'}
            popoverProps={{ minimal: true }}
          />
        </FFormGroup>
      </div>

      <div className={CLASSES.DIALOG_FOOTER}>
        <div className={CLASSES.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleClose}>
            <T id={'cancel'} />
          </Button>

          <Button
            intent={Intent.PRIMARY}
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            style={{ minWidth: '95px' }}
          >
            {isEditMode ? <T id={'edit'} /> : <T id={'invite'} />}
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default compose(withDialogActions)(InviteUserFormContent);
