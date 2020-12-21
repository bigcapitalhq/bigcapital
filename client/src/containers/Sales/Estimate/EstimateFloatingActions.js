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
import { CLASSES } from 'common/classes';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { saveInvoke } from 'utils';
import { If, Icon } from 'components';

/**
 * Estimate floating actions bar.
 */
export default function EstimateFloatingActions({
  isSubmitting,
  onSubmitClick,
  onCancelClick,
  onClearClick,
  estimateId,
  isDelivered,
}) {
  const { resetForm, submitForm } = useFormikContext();

  const handleSubmitDeliverBtnClick = (event) => {
    saveInvoke(onSubmitClick, event, {
      redirect: true,
      deliver: true,
    });
  };

  const handleSubmitDeliverAndNewBtnClick = (event) => {
    submitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
      deliver: true,
      resetForm: true,
    });
  };

  const handleSubmitDeliverContinueEditingBtnClick = (event) => {
    submitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
      deliver: true,
    });
  };

  const handleSubmitDraftBtnClick = (event) => {
    saveInvoke(onSubmitClick, event, {
      redirect: true,
      deliver: false,
    });
  };

  const handleSubmitDraftAndNewBtnClick = (event) => {
    submitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
      deliver: false,
      resetForm: true,
    });
  };

  const handleSubmitDraftContinueEditingBtnClick = (event) => {
    submitForm();
    saveInvoke(onSubmitClick, event, {
      redirect: false,
      deliver: false,
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
      {/* ----------- Save And Deliver ----------- */}
      <If condition={!estimateId || !isDelivered}>
        <ButtonGroup>
          <Button
            disabled={isSubmitting}
            intent={Intent.PRIMARY}
            type="submit"
            onClick={handleSubmitDeliverBtnClick}
            text={<T id={'save_and_deliver'} />}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  text={<T id={'deliver_and_new'} />}
                  onClick={handleSubmitDeliverAndNewBtnClick}
                />
                <MenuItem
                  text={<T id={'deliver_continue_editing'} />}
                  onClick={handleSubmitDeliverContinueEditingBtnClick}
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
      <If condition={estimateId && isDelivered}>
        <ButtonGroup>
          <Button
            disabled={isSubmitting}
            intent={Intent.PRIMARY}
            type="submit"
            onClick={handleSubmitDeliverBtnClick}
            text={<T id={'save'} />}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  text={<T id={'save_and_new'} />}
                  onClick={handleSubmitDeliverAndNewBtnClick}
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
        text={estimateId ? <T id={'reset'} /> : <T id={'clear'} />}
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
