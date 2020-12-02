import React, { memo } from 'react';
import { Button, Intent, FormGroup, Checkbox } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { saveInvoke } from 'utils';
import classNames from 'classnames';
import { FastField } from 'formik';
import { CLASSES } from 'common/classes';

/**
 * Item form floating actions.
 */
export default function ItemFormFloatingActions({
  isSubmitting,
  itemId,
  handleSubmit,
  onCancelClick,
  onSubmitClick,
  onSubmitAndNewClick,
}) {
  const handleCancelBtnClick = (event) => {
    saveInvoke(onCancelClick, event.currentTarget.value);
  };

  const handleSubmitBtnClick = (event) => {
    saveInvoke(onSubmitClick, event);
  };

  const handleSubmitAndNewBtnClick = (event) => {
    saveInvoke(onSubmitAndNewClick, event);
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <Button
        intent={Intent.PRIMARY}
        disabled={isSubmitting}
        onClick={handleSubmitBtnClick}
        type="submit"
      >
        {itemId ? <T id={'edit'} /> : <T id={'save'} />}
      </Button>

      <Button
        className={'ml1'}
        disabled={isSubmitting}
        onClick={handleSubmitAndNewBtnClick}
        type="submit"
      >
        <T id={'save_new'} />
      </Button>

      <Button className={'ml1'} onClick={handleCancelBtnClick}>
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
