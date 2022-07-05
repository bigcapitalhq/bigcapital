import React from 'react';
import { Button, Intent, FormGroup, Checkbox } from '@blueprintjs/core';
import styled from 'styled-components';
import { FastField, useFormikContext } from 'formik';
import classNames from 'classnames';

import { FormattedMessage as T } from '@/components';

import { CLASSES } from '@/common/classes';
import { useItemFormContext } from './ItemFormProvider';
import { saveInvoke } from '@/utils';

/**
 * Item form floating actions.
 */
export default function ItemFormFloatingActions({ onCancel }) {
  // Item form context.
  const { setSubmitPayload, isNewMode } = useItemFormContext();

  // Formik context.
  const { isSubmitting } = useFormikContext();

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    saveInvoke(onCancel, event);
  };

  // Handle submit button click.
  const handleSubmitBtnClick = (event) => {
    setSubmitPayload({ redirect: true });
  };

  // Handle submit & new button click.
  const handleSubmitAndNewBtnClick = (event) => {
    setSubmitPayload({ redirect: false });
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <SaveButton
        intent={Intent.PRIMARY}
        disabled={isSubmitting}
        loading={isSubmitting}
        onClick={handleSubmitBtnClick}
        type="submit"
        className={'btn--submit'}
      >
        {isNewMode ? <T id={'save'} /> : <T id={'edit'} />}
      </SaveButton>

      <Button
        className={classNames('ml1', 'btn--submit-new')}
        disabled={isSubmitting}
        onClick={handleSubmitAndNewBtnClick}
        type="submit"
      >
        <T id={'save_new'} />
      </Button>

      <Button
        disabled={isSubmitting}
        className={'ml1'}
        onClick={handleCancelBtnClick}
      >
        <T id={'close'} />
      </Button>

      {/*----------- Active ----------*/}
      <FastField name={'active'} type={'checkbox'}>
        {({ field }) => (
          <FormGroup inline={true} className={'form-group--active'}>
            <Checkbox
              inline={true}
              label={<T id={'active'} />}
              name={'active'}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

const SaveButton = styled(Button)`
  min-width: 100px;
`;