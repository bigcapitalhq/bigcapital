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
import { If, Icon } from 'components';

/**
 * Receipt floating actions bar.
 */
export default function ReceiptFormFloatingActions({
  isSubmitting,
  receiptId,
  isClosed,
  onSubmitClick,
  onCancelClick,
  onClearClick,
}) {
  const { resetForm, submitForm } = useFormikContext();

  const handleSubmitCloseBtnClick = (event) => {
    saveInvoke(onSubmitClick, event, {
      redirect: true,
      status: true,
    });
  };

  const handleSubmitCloseAndNewBtnClick = (event) => {
    submitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
      status: true,
      resetForm: true,
    });
  };

  const handleSubmitCloseContinueEditingBtnClick = (event) => {
    submitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
      status: true,
    });
  };

  const handleSubmitDraftBtnClick = (event) => {
    saveInvoke(onSubmitClick, event, {
      redirect: true,
      status: false,
    });
  };

  const handleSubmitDraftAndNewBtnClick = (event) => {
    submitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
      status: false,
      resetForm: true,
    });
  };

  const handleSubmitDraftContinueEditingBtnClick = (event) => {
    submitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
      status: false,
    });
  };

  const handleCancelBtnClick = (event) => {
    saveInvoke(onCancelClick, event);
  };

  const handleClearBtnClick = (event) => {
    // saveInvoke(onClearClick, event);
    resetForm();
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      {/* ----------- Save And Close ----------- */}
      <If condition={!receiptId || !isClosed}>
        <ButtonGroup>
          <Button
            disabled={isSubmitting}
            intent={Intent.PRIMARY}
            type="submit"
            onClick={handleSubmitCloseBtnClick}
            text={<T id={'save_close'} />}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  text={<T id={'close_and_new'} />}
                  onClick={handleSubmitCloseAndNewBtnClick}
                />
                <MenuItem
                  text={<T id={'close_continue_editing'} />}
                  onClick={handleSubmitCloseContinueEditingBtnClick}
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
        {/* ----------- Save As Draft ----------- */}
        <ButtonGroup>
          <Button
            disabled={isSubmitting}
            className={'ml1'}
            type="submit"
            onClick={handleSubmitDraftBtnClick}
            text={<T id={'save_as_draft'} />}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  text={<T id={'save_and_new'} />}
                  onClick={handleSubmitDraftAndNewBtnClick}
                />
                <MenuItem
                  text={<T id={'save_continue_editing'} />}
                  onClick={handleSubmitDraftContinueEditingBtnClick}
                />
              </Menu>
            }
            minimal={true}
            interactionKind={PopoverInteractionKind.CLICK}
            position={Position.BOTTOM_LEFT}
          >
            <Button
              disabled={isSubmitting}
              rightIcon={<Icon icon="arrow-drop-up-16" iconSize={20} />}
            />
          </Popover>
        </ButtonGroup>
      </If>
      {/* ----------- Save and New ----------- */}
      <If condition={receiptId && isClosed}>
        <ButtonGroup>
          <Button
            disabled={isSubmitting}
            intent={Intent.PRIMARY}
            type="submit"
            onClick={handleSubmitCloseBtnClick}
            text={<T id={'save'} />}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  text={<T id={'save_and_new'} />}
                  onClick={handleSubmitCloseAndNewBtnClick}
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
      </If>
      {/* ----------- Clear & Reset----------- */}
      <Button
        className={'ml1'}
        disabled={isSubmitting}
        onClick={handleClearBtnClick}
        text={receiptId ? <T id={'reset'} /> : <T id={'clear'} />}
      />
      {/* ----------- Cancel ----------- */}
      <Button
        className={'ml1'}
        onClick={handleCancelBtnClick}
        text={<T id={'cancel'} />}
      />
    </div>
  );
}
