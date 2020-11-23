import React, { useCallback } from 'react';
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
import { useFormikContext } from 'formik';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { saveInvoke } from 'utils';
import { Icon } from 'components';

/**
 * Receipt floating actions bar.
 */
export default function ReceiptFormFloatingActions({
  isSubmitting,
  receiptId,
  onSubmitClick,
  onCancelClick,
  onClearClick,
}) {
  const { resetForm, submitForm } = useFormikContext();

  const handleSubmitAndNewClick = useCallback(
    (event) => {
      submitForm();
      saveInvoke(onSubmitClick, event, {
        redirect: false,
      });
    },
    [submitForm],
  );

  const handleCancelBtnClick = (event) => {
    saveInvoke(onCancelClick, event);
  };

  const handleClearBtnClick = (event) => {
    // saveInvoke(onClearClick, event);
    resetForm();
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <ButtonGroup>
        {/* ----------- Save and New ----------- */}
        <Button
          disabled={isSubmitting}
          intent={Intent.PRIMARY}
          type="submit"
          onClick={(event) => {
            saveInvoke(onSubmitClick, event, {
              redirect: true,
            });
          }}
          text={receiptId ? <T id={'edit'} /> : <T id={'save'} />}
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
        {/* ----------- Clear & Reset----------- */}
        <Button
          className={'ml1'}
          disabled={isSubmitting}
          onClick={handleClearBtnClick}
          text={receiptId ? <T id={'reset'} /> : <T id={'clear'} />}
        />
        {/* ----------- Cancel  ----------- */}
        <Button
          className={'ml1'}
          onClick={handleCancelBtnClick}
          text={<T id={'cancel'} />}
        />
      </ButtonGroup>
    </div>
  );
}
