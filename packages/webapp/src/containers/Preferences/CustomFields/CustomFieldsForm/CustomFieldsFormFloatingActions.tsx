// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useFormikContext } from 'formik';

import { FormattedMessage as T } from '@/components';
import { Button, Intent, Classes } from '@blueprintjs/core';

import { useCustomFieldsFormContext } from './CustomFieldsFormProvider';

/**
 * Custom Fields form floating actions.
 */
export function CustomFieldsFormFloatingActions() {
  // History context.
  const history = useHistory();

  // Formik context.
  const { isSubmitting } = useFormikContext();

  // Custom fields form context.
  const { isNewMode } = useCustomFieldsFormContext();

  // Handle cancel button click.
  const handleCancelBtnClick = () => {
    history.go(-1);
  };

  return (
    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
      <Button
        intent={Intent.PRIMARY}
        loading={isSubmitting}
        style={{ minWidth: 85 }}
        type="submit"
      >
        {isNewMode ? (
          <T id={'save'} />
        ) : (
          <T id={'update'} />
        )}
      </Button>
      <Button
        onClick={handleCancelBtnClick}
        style={{ minWidth: 75 }}>
        <T id={'cancel'} />
      </Button>
    </div>
  );
}
