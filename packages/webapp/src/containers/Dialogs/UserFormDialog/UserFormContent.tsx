// @ts-nocheck
import React from 'react';
import {
  Intent,
  Classes,
  Button,
} from '@blueprintjs/core';
import { Form, useFormikContext } from 'formik';
import classNames from 'classnames';

import { FFormGroup, FInputGroup, FSelect, FormattedMessage as T } from '@/components';
import { CLASSES } from '@/constants/classes';
import { FieldRequiredHint } from '@/components';
import { useUserFormContext } from './UserFormProvider';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';
import { UserFormCalloutAlerts } from './components';

/**
 * User form content.
 */
function UserFormContent({
  calloutCode,

  // #withDialogActions
  closeDialog,
}) {
  const { isSubmitting } = useFormikContext();
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
          label={<T id={'email'} />}
          labelInfo={<FieldRequiredHint />}
        >
          <FInputGroup name={'email'} />
        </FFormGroup>

        {/* ----------- First name ----------- */}
        <FFormGroup
          name={'first_name'}
          label={<T id={'first_name'} />}
          labelInfo={<FieldRequiredHint />}
        >
          <FInputGroup name={'first_name'} />
        </FFormGroup>

        {/* ----------- Last name ----------- */}
        <FFormGroup
          name={'last_name'}
          label={<T id={'last_name'} />}
          labelInfo={<FieldRequiredHint />}
        >
          <FInputGroup name={'last_name'} />
        </FFormGroup>

        {/* ----------- Role name ----------- */}
        <FFormGroup
          name={'role_id'}
          label={<T id={'roles.label.role_name'} />}
          labelInfo={<FieldRequiredHint />}
          className={classNames(CLASSES.FILL, 'form-group--role_name')}
        >
          <FSelect
            name={'role_id'}
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
export default compose(withDialogActions)(UserFormContent);
