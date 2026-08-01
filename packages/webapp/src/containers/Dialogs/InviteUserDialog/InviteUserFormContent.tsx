import { Intent, Button } from '@blueprintjs/core';
import { Form, useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { useInviteUserFormContext } from './InviteUserFormProvider';
import type { InviteUserFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  FSelect,
  FieldRequiredHint,
  FormattedMessage as T,
  FFormGroup,
  FInputGroup,
} from '@/components';
import { CLASSES } from '@/constants/classes';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface InviteUserFormContentProps extends WithDialogActionsProps {}

function InviteUserFormContentInner({
  closeDialog,
}: InviteUserFormContentProps): React.ReactElement {
  const { isSubmitting } = useFormikContext<InviteUserFormValues>();
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
          label={intl.get('invite_user.label.email')}
          labelInfo={<FieldRequiredHint />}
        >
          <FInputGroup name={'email'} />
        </FFormGroup>
        {/* ----------- Role name ----------- */}
        <FFormGroup
          name={'roleId'}
          label={intl.get('invite_user.label.role_name')}
          labelInfo={<FieldRequiredHint />}
        >
          <FSelect
            name={'roleId'}
            items={roles ?? []}
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

export const InviteUserFormContent = compose(withDialogActions)(
  InviteUserFormContentInner,
);
