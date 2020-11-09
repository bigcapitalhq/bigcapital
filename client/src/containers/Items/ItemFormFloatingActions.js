import React from 'react';
import {
  Button,
  Intent,
  FormGroup,
  Checkbox
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { saveInvoke } from 'utils';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';

/**
 * Item form floating actions.
 */
export default function ItemFormFloatingActions({
  isSubmitting,
  itemId,
  onCancelClick
}) {
  const handleCancelBtnClick = (event) => {
    saveInvoke(onCancelClick, event.currentTarget.value);
  };
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <Button intent={Intent.PRIMARY} disabled={isSubmitting} type="submit">
        {itemId ? <T id={'edit'} /> : <T id={'save'} />}
      </Button>

      <Button className={'ml1'} disabled={isSubmitting}>
        <T id={'save_as_draft'} />
      </Button>

      <Button className={'ml1'} onClick={handleCancelBtnClick}>
        <T id={'close'} />
      </Button>

      {/*----------- Active ----------*/}
      <FormGroup
        label={' '}
        inline={true}
        className={'form-group--active'}
      >
        <Checkbox
          inline={true}
          label={<T id={'active'} />}
          // defaultChecked={values.active}
          // {...getFieldProps('active')}
        />
      </FormGroup>
    </div>
  );
}
