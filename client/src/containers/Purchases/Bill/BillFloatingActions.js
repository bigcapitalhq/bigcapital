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
import { useFormikContext } from 'formik';
import { FormattedMessage as T } from 'react-intl';
import { CLASSES } from 'common/classes';
import classNames from 'classnames';
import { saveInvoke } from 'utils';
import { If, Icon } from 'components';

/**
 * Bill floating actions bar.
 */
export default function BillFloatingActions({
  isSubmitting,
  onSubmitClick,
  onSubmitAndNewClick,
  onCancelClick,
  onClearClick,
  billId,
  billPublished,
}) {
  const { resetForm, submitForm } = useFormikContext();

  const handleSubmitPublishBtnClick = (event) => {
    saveInvoke(onSubmitClick, event, {
      redirect: true,
    });
  };

  const handleSubmitPublishAndNewBtnClick = (event) => {
    submitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
      publish: true,
      resetForm: true,
    });
  };

  const handleSubmitPublishContinueEditingBtnClick = (event) => {
    submitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
      publish: true,
    });
  };

  const handleSubmitDraftBtnClick = (event) => {
    saveInvoke(onSubmitClick, event, {
      redirect: true,
      publish: false,
    });
  };

  const handleSubmitDraftAndNewBtnClick = (event) => {
    submitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
      publish: false,
      resetForm: true,
    });
  };

  const handleSubmitDraftContinueEditingBtnClick = (event) => {
    submitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
      publish: true,
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
      {/* ----------- Save And Publish ----------- */}
      <If condition={!billId}>
        <ButtonGroup>
          <Button
            disabled={isSubmitting}
            intent={Intent.PRIMARY}
            type="submit"
            onClick={handleSubmitPublishBtnClick}
            text={<T id={'save_publish'} />}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  text={<T id={'publish_and_new'} />}
                  onClick={handleSubmitPublishAndNewBtnClick}
                />
                <MenuItem
                  text={<T id={'publish_continue_editing'} />}
                  onClick={handleSubmitPublishContinueEditingBtnClick}
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
      </If>
      {/* ----------- Save and New ----------- */}
      <If condition={billId && billPublished}>
        <ButtonGroup>
          <Button
            disabled={isSubmitting}
            intent={Intent.PRIMARY}
            type="submit"
            onClick={handleSubmitPublishBtnClick}
            text={<T id={'save'} />}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  text={<T id={'save_and_new'} />}
                  onClick={handleSubmitPublishAndNewBtnClick}
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
        text={billId ? <T id={'reset'} /> : <T id={'clear'} />}
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
