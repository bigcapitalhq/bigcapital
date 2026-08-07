import { Intent, Classes, Button } from '@blueprintjs/core';
import classNames from 'classnames';
import { Form, useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { UserFormCalloutAlerts } from './components';
import { useUserFormContext } from './UserFormProvider';
import type { UserFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  FFormGroup,
  FInputGroup,
  FSelect,
  FormattedMessage as T,
  FieldRequiredHint,
} from '@/components';
import { CLASSES } from '@/constants/classes';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface UserFormContentProps extends WithDialogActionsProps {
  calloutCode: number[];
}

/**
 * User form content.
 */
function UserFormContentInner({
  calloutCode,
  closeDialog,
}: UserFormContentProps): React.ReactElement {
  const { isSubmitting } = useFormikContext<UserFormValues>();
  const { dialogName, roles, isAuth } = useUserFormContext();

  const handleClose = () => {
    closeDialog(dialogName);
  };

  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        <UserFormCalloutAlerts calloutCodes={calloutCode} />

        {/* ----------- Email ----------- */}
        <FFormGroup
          name={'email'}
          label={intl.get('email')}
          labelInfo={<FieldRequiredHint />}
        >
          <FInputGroup name={'email'} />
        </FFormGroup>

        {/* ----------- First name ----------- */}
        <FFormGroup
          name={'firstName'}
          label={intl.get('first_name')}
          labelInfo={<FieldRequiredHint />}
        >
          <FInputGroup name={'firstName'} />
        </FFormGroup>

        {/* ----------- Last name ----------- */}
        <FFormGroup
          name={'lastName'}
          label={intl.get('last_name')}
          labelInfo={<FieldRequiredHint />}
        >
          <FInputGroup name={'lastName'} />
        </FFormGroup>

        {/* ----------- Role name ----------- */}
        <FFormGroup
          name={'roleId'}
          label={intl.get('roles.label.role_name')}
          labelInfo={<FieldRequiredHint />}
          className={classNames(CLASSES.FILL, 'form-group--role_name')}
        >
          <FSelect
            name={'roleId'}
            items={roles}
            valueAccessor={'id'}
            textAccessor={'name'}
            popoverProps={{ minimal: true }}
            disabled={isAuth}
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
            style={{ minWidth: '85px' }}
          >
            <T id={'edit'} />
          </Button>
        </div>
      </div>
    </Form>
  );
}
export const UserFormContent = compose(withDialogActions)(UserFormContentInner);
