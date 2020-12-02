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
import { saveInvoke } from 'utils';
import { Icon } from 'components';

/**
 * Payment made floating actions bar.
 */
export default function PaymentMadeFloatingActions({
  isSubmitting,
  onSubmitClick,
  onCancelClick,
  onClearBtnClick,
  onSubmitForm,
  paymentMadeId,
}) {
  const handleSubmitBtnClick = (event) => {
    saveInvoke(onSubmitClick, event, {
      redirect: true,
    });
  };

  const handleClearBtnClick = (event) => {
    onClearBtnClick && onClearBtnClick(event);
  };

  const handleCancelBtnClick = (event) => {
    onCancelClick && onCancelClick(event);
    saveInvoke(onCancelClick, event);
  };

  const handleSubmitAndNewClick = (event) => {
    onSubmitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
    });
  };

  const handleSubmitContinueEditingBtnClick = (event) => {
    onSubmitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
      publish: true,
    });
  };
  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      {/* ----------- Save and New ----------- */}
      <ButtonGroup>
        <Button
          disabled={isSubmitting}
          intent={Intent.PRIMARY}
          type="submit"
          onClick={handleSubmitBtnClick}
          text={paymentMadeId ? <T id={'edit'} /> : <T id={'save'} />}
        />
        <Popover
          content={
            <Menu>
              <MenuItem
                text={<T id={'save_and_new'} />}
                onClick={handleSubmitAndNewClick}
              />
              <MenuItem
                text={<T id={'save_continue_editing'} />}
                onClick={handleSubmitContinueEditingBtnClick}
              />
            </Menu>
          }
          minimal={true}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            disabled={isSubmitting}
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
        text={paymentMadeId ? <T id={'reset'} /> : <T id={'clear'} />}
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
