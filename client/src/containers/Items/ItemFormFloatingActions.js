import React from 'react';
import { Button, Intent, FormGroup, Checkbox } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { FastField, useFormikContext } from 'formik';

import { CLASSES } from 'common/classes';
import { useItemFormContext } from './ItemFormProvider';

/**
 * Item form floating actions.
 */
export default function ItemFormFloatingActions() {
  // History context.
  const history = useHistory();

  // Item form context.
  const { setSubmitPayload, isNewMode, isDuplicateMode } = useItemFormContext();

  // Formik context.
  const { isSubmitting } = useFormikContext();

  // Handle cancel button click.
  const handleCancelBtnClick = (event) => {
    history.goBack();
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
      <Button
        intent={Intent.PRIMARY}
        disabled={isSubmitting}
        loading={isSubmitting}
        onClick={handleSubmitBtnClick}
        type="submit"
        className={'btn--submit'}
      >
        {isNewMode || isDuplicateMode ? <T id={'save'} /> : <T id={'edit'} />}
      </Button>

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
