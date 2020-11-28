import React from 'react';
import {
  Intent,
  Button,
  ButtonGroup,
  Popover,
  PopoverInteractionKind,
  Position,
  Menu,
  MenuItem,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { useFormikContext } from 'formik';
import { saveInvoke } from 'utils';
import { Icon } from 'components';

/**
 * Customer floating actions bar.
 */
export default function CustomerFloatingActions({
  onSubmitClick,
  onCancelClick,
  isSubmitting,
  customerId,
}) {
  const { resetForm, submitForm } = useFormikContext();

  const handleSubmitBtnClick = (event) => {
    saveInvoke(onSubmitClick, event, {
      noRedirect: false,
    });
  };

  const handleCancelBtnClick = (event) => {
    saveInvoke(onCancelClick, event);
  };

  const handleClearBtnClick = (event) => {
    // saveInvoke(onClearClick, event);
    resetForm();
  };

  const handleSubmitAndNewClick = (event) => {
    submitForm();
    saveInvoke(onSubmitClick, event, {
      noRedirect: true,
    });
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <ButtonGroup>
        {/* ----------- Save and New ----------- */}
        <Button
          disabled={isSubmitting}
          intent={Intent.PRIMARY}
          type="submit"
          onClick={handleSubmitBtnClick}
          text={customerId ? <T id={'edit'} /> : <T id={'save'} />}
        />
        <Popover
          content={
            <Menu>
              <MenuItem
                text={<T id={'save_and_new'} />}
                onClick={handleSubmitAndNewClick}
              />
            </Menu>
          }
          minimal={true}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            intent={Intent.PRIMARY}
            rightIcon={<Icon icon="arrow-drop-up-16" iconSize={20} />}
          />
        </Popover>
      </ButtonGroup>
      {/* ----------- Clear & Reset----------- */}
      <Button
        className={'ml1'}
        disabled={isSubmitting}
        onClick={handleClearBtnClick}
        text={customerId ? <T id={'reset'} /> : <T id={'clear'} />}
      />
      {/* ----------- Cancel  ----------- */}
      <Button
        className={'ml1'}
        onClick={handleCancelBtnClick}
        text={<T id={'cancel'} />}
      />
    </div>
  );
}
